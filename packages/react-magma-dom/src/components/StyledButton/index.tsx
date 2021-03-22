import * as React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  buildActiveBackground,
  buildActiveColor,
  buildAfterBackground,
  buildButtonBorderRadius,
  buildButtonFontSize,
  buildButtonLineHeight,
  buildButtonSize,
  buildButtonPadding,
  buildBorderColor,
  buildButtonBackground,
  buildColor,
  buildFocusBackground,
  buildFocusColor,
} from './styles';
import { ThemeContext } from '../../theme/ThemeContext';
import { ButtonProps, ButtonSize, ButtonVariant } from '../Button';
import { Spinner } from '../Spinner';

export interface StyledButtonProps extends ButtonProps {
  href?: string;
  iconOnly?: boolean;
  isLoading?: boolean;
}

export const buttonStyles = props => css`
  align-items: center;
  background: ${buildButtonBackground(props)};
  border: ${props.variant === 'outline' ||
  (props.variant !== 'link' && props.color === 'secondary' && !props.isInverse)
    ? '2px solid'
    : '0'};
  border-color: ${buildBorderColor(props)};
  border-radius: ${buildButtonBorderRadius(props)};
  color: ${buildColor(props)};
  cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
  display: ${props.isFullWidth ? 'flex' : 'inline-flex'};
  flex-shrink: 0;
  font-family: ${props.theme.bodyFont};
  font-size: ${buildButtonFontSize(props)};
  font-weight: 600;
  height: ${buildButtonSize(props)};
  justify-content: center;
  line-height: ${buildButtonLineHeight(props)};
  margin: ${props.isFullWidth
    ? `${props.theme.spaceScale.spacing02} 0`
    : props.theme.spaceScale.spacing02};
  min-width: ${props.size === 'small' ? '0' : props.theme.spaceScale.spacing13};
  overflow: hidden;
  padding: ${buildButtonPadding(props)};
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: ${props.textTransform || 'uppercase'};
  touch-action: manipulation;
  transition: background 0.35s, color 0.35s;
  vertical-align: middle;
  white-space: nowrap;
  width: ${props.iconOnly
    ? buildButtonSize(props)
    : props.isFullWidth
    ? '100%'
    : 'auto'};

  &:not(:disabled) {
    &:focus {
      outline: 2px dotted
        ${props.isInverse
          ? props.theme.colors.focusInverse
          : props.theme.colors.focus};
      outline-offset: 3px;
    }

    &:hover,
    &:focus {
      background: ${buildFocusBackground(props)};
      color: ${buildFocusColor(props)};
    }

    &:after {
      background: ${buildAfterBackground(props)};
      border-radius: 50%;
      content: '';
      height: ${props.theme.spaceScale.spacing07};
      left: 50%;
      opacity: 0;
      padding: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%) scale(1);
      transition: opacity 1s, transform 0.5s;
      width: ${props.theme.spaceScale.spacing07};
    }

    &:active {
      background: ${buildActiveBackground(props)};
      color: ${buildActiveColor(props)};
      &:after {
        opacity: 0.4;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0s;
      }
    }
  }

  svg {
    flex-shrink: 0;
  }

  ${props.iconOnly &&
  css`
    display: inline-flex;
    justify-content: center;
    line-height: 1;
    min-width: 0;
    padding: 0;
  `}
`;

export const BaseStyledButton = styled.button`
  ${buttonStyles}
`;

export const StyledButton = React.forwardRef<
  HTMLButtonElement,
  StyledButtonProps
>((props, ref) => {
  const { size, variant, isInverse, children, testId, isLoading } = props;
  const theme = React.useContext(ThemeContext);

  const spinnerColor =
    isInverse &&
    (variant === ButtonVariant.outline || variant === ButtonVariant.link)
      ? theme.colors.neutral08
      : theme.colors.neutral03;

  const spinnerSize =
    size === ButtonSize.small
      ? theme.iconSizes.xSmall
      : size === ButtonSize.large
      ? theme.iconSizes.large
      : theme.iconSizes.medium;

  const SpinnerWrapper = styled.div`
    position: absolute;
    display: flex;
  `;

  const ChildrenWrapper = styled.div<{ isLoading: boolean }>`
    visibility: ${props => (props.isLoading ? 'hidden' : 'visible')};
  `;

  return (
    <BaseStyledButton
      {...props}
      data-testid={testId}
      ref={ref}
      theme={theme}
      disabled={isLoading || props.disabled}
    >
      {isLoading && (
        <SpinnerWrapper>
          <Spinner
            testId={`${testId}-spinner`}
            color={spinnerColor}
            size={spinnerSize}
          />
        </SpinnerWrapper>
      )}
      <ChildrenWrapper isLoading={isLoading}>{children}</ChildrenWrapper>
    </BaseStyledButton>
  );
});
