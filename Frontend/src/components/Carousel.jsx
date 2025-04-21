import slide1 from "../assets/images/anhthuvien1.jpg";
import slide2 from "../assets/images/anhthuvien2.jpg";
import slide3 from "../assets/images/anhthuvien3.jpg";

const Carousel = () => {
  return (
    <div className="carousel w-full max-w-[1200px] mx-auto mb-[20px] overflow-hidden relative">
      <div className="carousel-inner flex w-[300%] animate-[slide_6s_infinite]">
        <div className="carousel-item w-[33.33%] flex-shrink-0">
          <img src={slide1} alt="Slide 1" className="w-full h-[300px] object-cover" />
        </div>
        <div className="carousel-item w-[33.33%] flex-shrink-0">
          <img src={slide2} alt="Slide 2" className="w-full h-[300px] object-cover" />
        </div>
        <div className="carousel-item w-[33.33%] flex-shrink-0">
          <img src={slide3} alt="Slide 3" className="w-full h-[300px] object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Carousel;