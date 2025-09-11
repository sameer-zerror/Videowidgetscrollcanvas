

// import { useEffect, useRef, useState } from "react";

// const Canvass = () => {
//   const canvasRef = useRef(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
//   const imagesRef = useRef([]); // store preloaded images here

//   useEffect(() => {
//     setDimensions({
//       width: window.innerWidth,
//       height: window.innerHeight,
//     });

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     // const frameCount = 297;
//     const frameCount = 160;

//     const currentFrame = (i) =>
//       `/watchcanvasimages/submariner-scrollersive-landscape-0${(i + 1).toString().padStart(3, "0")}.webp`;

//     // Preload all frames into memory
//     const preloadImages = () => {
//       const arr = [];
//       for (let i = 0; i < frameCount; i++) {
//         const img = new Image();
//         img.src = currentFrame(i);
//         arr.push(img);
//       }
//       imagesRef.current = arr;
//     };

//     // Draw the first frame immediately after it's loaded
//     const firstImg = new Image();
//     firstImg.src = currentFrame(0);
//     firstImg.onload = () => {
//       context.drawImage(firstImg, 0, 0, canvas.width, canvas.height);
//     };

//     preloadImages();

//     const updateImage = (index) => {
//       const img = imagesRef.current[index];
//       if (img && img.complete) {
//         context.drawImage(img, 0, 0, canvas.width, canvas.height);
//       }
//     };

//     const onScroll = () => {
//       const wrap = document.querySelector(".png__sequence");
//       const rect = wrap.getBoundingClientRect();
//       const start = 0;
//       const end = window.innerHeight * 4;

//       if (rect.top <= start && Math.abs(rect.top) <= end) {
//         const scrollFraction = Math.abs(rect.top) / end;
//         const frameIndex = Math.min(
//           frameCount - 1,
//           Math.floor(scrollFraction * frameCount)
//         );
//         requestAnimationFrame(() => updateImage(frameIndex));
//       }
//     };

//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <div className="png__sequence" style={{ height: "500vh" }}>
//       <canvas
//         ref={canvasRef}
//         width={dimensions.width}
//         height={dimensions.height}
//         className="png__sequence__canvas"
//         id="canvas"
//       />
//     </div>
//   );
// };

// export default Canvass;



import { useEffect, useRef, useState } from "react";

const Canvass = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imagesRef = useRef([]);
  const [isLandscape, setIsLandscape] = useState(true);
  const basePathRef = useRef("");
  const frameCount = 160;

  // Get frame image URL
  const currentFrame = (i, basePath) =>
    `${basePath}-0${(i + 1).toString().padStart(3, "0")}.webp`;

  // Preload images into ref
  const preloadImages = (basePath) => {
    const arr = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i, basePath);
      arr.push(img);
    }
    imagesRef.current = arr;
  };

  // Draw a specific frame
  const updateImage = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const img = imagesRef.current[index];
    if (img && img.complete) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  // Get frame based on scroll position
  const getScrollFrameIndex = () => {
    const wrap = document.querySelector(".png__sequence");
    if (!wrap) return 0;

    const rect = wrap.getBoundingClientRect();
    const start = 0;
    const end = window.innerHeight * 4;

    if (rect.top > start) {
      // Before the animation starts
      return 0;
    }

    if (Math.abs(rect.top) >= end) {
      // After the animation ends
      return frameCount - 1;
    }

    // Within animation range
    const scrollFraction = Math.abs(rect.top) / end;
    return Math.min(
      frameCount - 1,
      Math.floor(scrollFraction * frameCount)
    );
  };

  // Update base path, preload images, update dimensions
  const updateBasePathAndDimensions = () => {
    const landscape = window.innerWidth >= window.innerHeight;
    setIsLandscape(landscape);

    const newBasePath = landscape
      ? "/watchcanvasimages/submariner-scrollersive-landscape"
      : "/watchcanvasportraitimages/submariner-scrollersive-portrait";

    basePathRef.current = newBasePath;

    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    preloadImages(newBasePath);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial setup
    updateBasePathAndDimensions();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const firstImg = new Image();
    firstImg.src = currentFrame(0, basePathRef.current);
    firstImg.onload = () => {
      context.drawImage(firstImg, 0, 0, canvas.width, canvas.height);
    };

    // Scroll handler
    const onScroll = () => {
      const frameIndex = getScrollFrameIndex();
      requestAnimationFrame(() => updateImage(frameIndex));
    };

    // Resize handler
    const onResize = () => {
      updateBasePathAndDimensions();

      // Delay to wait for new images to preload
      setTimeout(() => {
        const frameIndex = getScrollFrameIndex();
        updateImage(frameIndex);
      }, 100);
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="png__sequence" style={{ height: "500vh" }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="png__sequence__canvas"
        id="canvas"
      />
    </div>
  );
};

export default Canvass;
