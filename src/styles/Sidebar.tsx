import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const navItemStyles = css<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  color: ${(p) => p.theme.text};
  height: 48px;
  gap: 12px;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  overflow: hidden;

  svg {
    min-width: 20px;
    min-height: 20px;
    flex-shrink: 0;
  }

  .label {
    white-space: nowrap;
    font-size: 14px;
    opacity: ${(p) => (p.$collapsed ? 0 : 1)};
    width: ${(p) => (p.$collapsed ? "0px" : "auto")};
    transition:
      opacity 0.2s ease,
      width 0.2s ease;
  }

  &:hover {
    background: ${(p) => p.theme.cardBg}80;
  }
`;

export const Aside = styled(motion.aside)<{ $collapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background: ${(p) => p.theme.sidebarBg || "white"};
  padding: 24px 14px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-sizing: border-box;
  border-right: 1px solid ${(p) => p.theme.cardBg};
  overflow: hidden;

  @media (max-width: 768px) {
    width: 280px !important;
    transform: translateX(${(p) => (p.$collapsed ? "-100%" : "0%")});
    transition: transform 0.3s ease-in-out;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NavItemLink = styled(NavLink)<{ $collapsed: boolean }>`
  ${navItemStyles}
  position: relative;

  &.active {
    background: #6366f115;
    color: #6366f1;
    font-weight: 600;

    /* Left accent indicator */
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 15%;
      height: 70%;
      width: 4px;
      background: #6366f1;
      border-radius: 0 4px 4px 0;
    }
  }

  &:hover:not(.active) {
    background: ${(p) => p.theme.cardBg}50;
    transform: translateX(4px);
    transition: all 0.2s ease;
  }
`;

export const NavItemButton = styled.div<{ $collapsed: boolean }>`
  ${navItemStyles}
`;

export const FooterRow = styled.div<{ $collapsed: boolean }>`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .theme-toggle {
    ${navItemStyles}
    background: ${(p) => p.theme.cardBg};
  }

  .version {
    font-size: 10px;
    text-align: center;
    opacity: 0.5;
  }
`;
