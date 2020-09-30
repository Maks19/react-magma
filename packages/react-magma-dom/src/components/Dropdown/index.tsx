import * as React from 'react';
import styled from '../../theme/styled';
import { useForkedRef } from '../../utils';

export enum DropdownDropDirection {
  down = 'down', //default
  left = 'left',
  right = 'right',
  up = 'up',
}

export enum DropdownAlignment {
  start = 'start', //default
  end = 'end',
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  activeIndex?: number;
  alignment?: DropdownAlignment;
  dropDirection?: DropdownDropDirection;
  maxHeight?: string | number;
  onBeforeShiftFocus?: (event: React.SyntheticEvent) => void;
  ref?: any;
  testId?: string;
  width?: string | number;
}

const Container = styled.div`
  display: inline-block;
  position: relative;
`;

interface DropdownContextInterface {
  activeItemIndex?: number;
  alignment?: DropdownAlignment;
  closeDropdown?: (event: React.SyntheticEvent | React.KeyboardEvent) => void;
  dropDirection?: DropdownDropDirection;
  handleButtonKeyDown?: (event: React.KeyboardEvent) => void;
  handleMenuBlur?: (event: React.FocusEvent) => void;
  itemRefArray?: any;
  isFixedWidth?: boolean;
  isOpen?: boolean;
  maxHeight?: string;
  menuRef?: any;
  openDropdown?: () => void;
  registerDropdownMenuItem: (element) => void;
  setActiveItemIndex?: React.Dispatch<React.SetStateAction<number>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleRef?: any;
  width?: string;
}

export const DropdownContext = React.createContext<DropdownContextInterface>({
  isOpen: false,
  setIsOpen: () => false,
  registerDropdownMenuItem: element => {},
});

export const useDropdownContext = () => React.useContext(DropdownContext);

export const Dropdown: React.FunctionComponent<DropdownProps> = React.forwardRef(
  (
    {
      activeIndex,
      alignment,
      children,
      dropDirection,
      maxHeight,
      onBeforeShiftFocus,
      testId,
      width,
      ...other
    }: DropdownProps,
    forwardedRef: any
  ) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const [activeItemIndex, setActiveItemIndex] = React.useState<number>(
      activeIndex || -1
    );

    const itemRefArray = React.useRef([]);
    const shouldFocusToggleElement = React.useRef<boolean>(true);

    const ownRef = React.useRef<any>();
    const toggleRef = React.useRef<HTMLButtonElement>();
    const menuRef = React.useRef<any>([]);

    const ref = useForkedRef(forwardedRef, ownRef);

    function registerDropdownMenuItem(menuItemRef) {
      if (
        itemRefArray.current.find(
          ({ current: item }) => item === menuItemRef.current
        ) == null
      ) {
        const index = itemRefArray.current.findIndex(({ current: item }) => {
          if (!item || !menuItemRef.current) return false;

          return Boolean(
            item.compareDocumentPosition(menuItemRef.current) &
              Node.DOCUMENT_POSITION_PRECEDING
          );
        });

        const newItem = menuItemRef;

        itemRefArray.current =
          index === -1
            ? [...itemRefArray.current, newItem]
            : [
                ...itemRefArray.current.slice(0, index),
                newItem,
                ...itemRefArray.current.slice(index),
              ];
      }
    }

    React.useEffect(() => {
      if (activeIndex >= 0) {
        setActiveItemIndex(activeIndex);
      }
    }, [activeIndex]);

    React.useEffect(() => {
      if (isOpen) {
        document.addEventListener('click', globalClickListener);
      }

      return () => {
        document.removeEventListener('click', globalClickListener);
      };
    }, [isOpen]);

    function globalClickListener(event) {
      if (isOpen && ownRef.current && !ownRef.current.contains(event.target)) {
        closeDropdown(event);
      }
    }

    function openDropdown() {
      setIsOpen(true);
      toggleRef.current.focus();
    }

    function closeDropdown(event) {
      setIsOpen(false);

      if (onBeforeShiftFocus && typeof onBeforeShiftFocus === 'function') {
        event.preventMagmaFocus = handlePreventMagmaFocus;
        onBeforeShiftFocus(event);
      }

      if (shouldFocusToggleElement.current) {
        setTimeout(() => {
          if (toggleRef.current) {
            toggleRef.current.focus();
          }
        }, 0);
      }

      shouldFocusToggleElement.current = true;
    }

    function getFilteredItems(): [any, number] {
      const filteredItems = itemRefArray.current.filter(
        itemRef => itemRef.current
      );
      const filteredItemIndex = filteredItems
        .map(filteredItem => filteredItem.current)
        .indexOf(document.activeElement);

      return [filteredItems, filteredItemIndex];
    }

    function handleKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDropdown(event);
      }

      if (event.key === 'ArrowDown') {
        const [filteredItems, filteredItemIndex] = getFilteredItems();

        if (filteredItems.length === 0) {
          return;
        }

        event.preventDefault();

        if (
          filteredItemIndex === -1 ||
          filteredItemIndex === filteredItems.length - 1
        ) {
          filteredItems[0].current.focus();
        } else {
          filteredItems[filteredItemIndex + 1].current.focus();
        }
      }

      if (event.key === 'ArrowUp') {
        const [filteredItems, filteredItemIndex] = getFilteredItems();

        if (filteredItems.length === 0) {
          return;
        }

        event.preventDefault();

        if (filteredItemIndex === -1 || filteredItemIndex === 0) {
          filteredItems[filteredItems.length - 1].current.focus();
        } else {
          filteredItems[filteredItemIndex - 1].current.focus();
        }
      }
    }

    function handleButtonKeyDown(event: React.KeyboardEvent) {
      const { key, shiftKey } = event;

      if ((key === 'Tab' || (shiftKey && key === 'Tab')) && isOpen) {
        setIsOpen(false);
      }
    }

    function handleMenuBlur(event: React.SyntheticEvent) {
      const { currentTarget } = event;

      setTimeout(() => {
        const isInMenu = currentTarget.contains(document.activeElement);

        if (!isInMenu && isOpen) {
          setIsOpen(false);
        }
      }, 0);
    }

    function handlePreventMagmaFocus() {
      shouldFocusToggleElement.current = false;
    }

    const maxHeightString =
      typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;

    const widthString = typeof width === 'number' ? `${width}px` : width;

    return (
      <DropdownContext.Provider
        value={{
          activeItemIndex,
          alignment,
          closeDropdown,
          dropDirection,
          handleButtonKeyDown,
          handleMenuBlur,
          itemRefArray,
          isFixedWidth: !!width,
          isOpen,
          maxHeight: maxHeightString,
          menuRef,
          openDropdown,
          registerDropdownMenuItem,
          setActiveItemIndex,
          setIsOpen,
          toggleRef,
          width: widthString,
        }}
      >
        <Container
          {...other}
          ref={ref}
          data-testid={testId}
          onKeyDown={isOpen ? handleKeyDown : null}
        >
          {children}
        </Container>
      </DropdownContext.Provider>
    );
  }
);
