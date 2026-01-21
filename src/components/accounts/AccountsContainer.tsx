import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAccounts,
  selectActiveAccount,
} from "../../redux/selectors/appSelectors";
import { setActiveAccount } from "../../redux/actions/accountActions";
import type { Account } from "../../services/accounts";

import {
  AccountsSectionCard,
  SectionHeader,
  HeaderActions,
  SettingsIcon,
  AddAccountSmall,
  CarouselContainer,
  CarouselButton,
  AccountsHorizontalScroll,
  AccountPill,
  PillInfo,
  SelectAllWrapper,
  AllAccountsLink,
} from "../../styles/Accounts";

import { AddAccountModal } from "../modals/AddAccountModal";

const AccountsContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const accounts = useSelector(selectAccounts);
  const activeAccount = useSelector(selectActiveAccount);

  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Calculate total balance
  const totalBalance = useMemo(
    () =>
      accounts.reduce((acc: number, curr: Account) => acc + curr.balance, 0),
    [accounts],
  );

  // Logic to show/hide carousel buttons based on scroll position
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBtn(scrollLeft > 10);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [accounts]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      const newPos =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({ left: newPos, behavior: "smooth" });
    }
  };

  return (
    <>
      <AccountsSectionCard>
        <SectionHeader>
          <div className="title-group">
            <h3>My Accounts</h3>
            <span className="total-label">
              Total: ₹{totalBalance.toLocaleString()}
            </span>
          </div>
          <HeaderActions>
            <AddAccountSmall onClick={() => setIsAddModalOpen(true)}>
              + Add Account
            </AddAccountSmall>
            <SettingsIcon
              onClick={() => navigate("/accounts")}
              title="Manage Accounts"
            >
              ⚙️
            </SettingsIcon>
          </HeaderActions>
        </SectionHeader>

        <CarouselContainer>
          {showLeftBtn && (
            <CarouselButton
              className="left"
              onClick={() => handleScroll("left")}
            >
              ‹
            </CarouselButton>
          )}

          <AccountsHorizontalScroll ref={scrollRef}>
            {accounts.map((acc: Account) => (
              <AccountPill
                key={acc._id}
                $active={activeAccount === acc._id || activeAccount === "all"}
                onClick={() => dispatch(setActiveAccount(acc._id) as any)}
              >
                <PillInfo>
                  <p>{acc.name}</p>
                  <small>₹{acc.balance.toLocaleString()}</small>
                </PillInfo>
              </AccountPill>
            ))}
          </AccountsHorizontalScroll>

          {showRightBtn && (
            <CarouselButton
              className="right"
              onClick={() => handleScroll("right")}
            >
              ›
            </CarouselButton>
          )}
        </CarouselContainer>

        <SelectAllWrapper>
          <AllAccountsLink
            onClick={() => dispatch(setActiveAccount("all") as any)}
          >
            Select All Accounts
          </AllAccountsLink>
        </SelectAllWrapper>
      </AccountsSectionCard>

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};

export default AccountsContainer;
