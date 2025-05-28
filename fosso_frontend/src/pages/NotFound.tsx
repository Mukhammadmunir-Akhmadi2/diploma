import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <div className="flex-grow flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-6xl font-light mb-4">404</h1>
          <p className="text-xl text-fosso-muted mb-6">Page not found</p>
          <p className="text-fosso-muted mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed or is
            temporarily unavailable.
          </p>
          <Button
            className="rounded-full bg-black hover:bg-gray-800 text-white"
            asChild
          >
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
