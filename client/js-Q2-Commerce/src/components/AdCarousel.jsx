import { useState, useEffect } from "react";
import styles from "../styles/AdCarousel.module.css";

const ads = [
  { id: 1, text: "🔥 50% Off on Smart Watches! Limited Time Only!", image: "/images/smartwatch-sale.jpg" },
  { id: 2, text: "🚀 New Wireless Earbuds Released! Grab Yours Today!", image: "/images/earbuds-launch.jpg" },
  { id: 3, text: "⚡ Flash Sale! Up to 70% Off Select Items!", image: "/images/flash-sale.jpg" }
];

const AdCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Auto-rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carousel}>
      <img src={ads[currentIndex].image} alt="Ad Banner" />
      <p>{ads[currentIndex].text}</p>
    </div>
  );
};

export default AdCarousel;
