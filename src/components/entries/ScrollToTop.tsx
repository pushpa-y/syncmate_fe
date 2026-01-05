import { useState, useEffect } from "react";
import styled from "styled-components";

const ScrollButton = styled.button<{ $visible: boolean }>`
  position: fixed;
  bottom: 100px; /* Above the FloatingAddButton */
  right: 20px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.glassBorder};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$visible ? "1" : "0")};
  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};
  transform: translateY(${(props) => (props.$visible ? "0" : "20px")});
  z-index: 99;

  &:hover {
    background: ${(props) => props.theme.accent};
    color: white;
    transform: translateY(-5px);
  }
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ScrollButton
      $visible={isVisible}
      onClick={scrollToTop}
      title="Scroll to top"
    >
      ↑
    </ScrollButton>
  );
};

export default ScrollToTop;
