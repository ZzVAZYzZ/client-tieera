import React from "react";

const useViewport = () => {
  // const [width, setWidth] = React.useState(window.innerWidth);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handleWindowResize = () => setWidth(window.innerWidth);
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width };
};

export default useViewport;
