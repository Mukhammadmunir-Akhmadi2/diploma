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
          title="New Arrivals"
          subtitle="The latest styles added to the collection"
          actionLabel="View All"
          actionUrl="/new-in"
        />

        <FeaturedProducts
          isPopular={true}
          gender={gender}
          title="Trending Now"
          actionLabel="Explore"
          actionUrl="/trending"
        />
      </main>
    </>
  );
};

export default Index;
