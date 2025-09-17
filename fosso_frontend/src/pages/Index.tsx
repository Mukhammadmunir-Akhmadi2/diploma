import React from "react";
import HeroBanner from "../components/HeroBanner";
import FeaturedProducts from "../components/FeaturedProducts";
import type { Gender } from "../types/enums";
interface IndexProps {
  gender?: Gender;
}

const Index: React.FC<IndexProps> = ({ gender }) => {
  return (
    <>
      <main>
        <HeroBanner />
        <FeaturedProducts
          isNewIn={true}
          gender={gender}
          actionLabel="View All"
          actionUrl="/new-in"
        />

        <FeaturedProducts
          isPopular={true}
          gender={gender}
          actionLabel="Explore"
          actionUrl="/trending"
        />
      </main>
    </>
  );
};

export default Index;
