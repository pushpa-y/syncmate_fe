import styled from "styled-components";

export const ProfileContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
`;

export const AvatarCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${(props) => props.theme.accent};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
`;

export const ProfileCard = styled.div`
  background: ${(props) => props.theme.cardBg};
  border: 1px solid ${(props) => props.theme.glassBorder};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 12px;
    text-transform: uppercase;
    color: ${(props) => props.theme.muted};
    font-weight: 600;
  }

  p {
    font-size: 16px;
    color: ${(props) => props.theme.text};
    margin: 0;
  }
`;

export const ProfileInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.glassBorder};
  background: ${(props) => props.theme.sidebarBg};
  color: ${(props) => props.theme.text};
  font-size: 16px;
  margin-top: 4px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.accent};
  }
`;

export const ActionButton = styled.button<{
  $variant?: "primary" | "secondary";
}>`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$variant === "secondary" ? "transparent" : props.theme.accent};
  color: ${(props) =>
    props.$variant === "secondary" ? props.theme.text : "white"};
  border: ${(props) =>
    props.$variant === "secondary"
      ? `1px solid ${props.theme.glassBorder}`
      : "none"};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;
