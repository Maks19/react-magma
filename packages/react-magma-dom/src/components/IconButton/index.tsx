import * as React from 'react';
import styled from '../../theme/styled';
import { StyledButton } from '../StyledButton';
import {
  ButtonProps,
  ButtonColor,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  ButtonTextTransform,
} from '../Button';
import { IconProps } from 'react-magma-icons';
import { omit, Omit, XOR } from '../../utils';
import { ThemeContext } from '../../theme/ThemeContext';

export enum ButtonIconPosition {
  left = 'left',
  right = 'right',
}

export interface IconOnlyButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactElement<IconProps>;
  'aria-label': string;
}

export interface IconTextButtonProps extends ButtonProps {
  icon: React.ReactElement<IconProps>;
  children: React.ReactChild | React.ReactChild[];
  iconPosition?: ButtonIconPosition;
}

export type IconButtonProps = XOR<IconOnlyButtonProps, IconTextButtonProps>;

export interface SpanProps {
  size?: ButtonSize;
}

const SpanTextLeft = styled.span<SpanProps>`
  padding-right: ${props => getIconPadding(props)};
`;

const SpanTextRight = styled.span<SpanProps>`
  padding-left: ${props => getIconPadding(props)};
`;

function getIconPadding(props) {
  switch (props.size) {
    case 'large':
      return props.theme.spaceScale.spacing05;
    case 'small':
      return props.theme.spaceScale.spacing02;
    default:
      return props.theme.spaceScale.spacing03;
  }
}

function getIconSize(size) {
  switch (size) {
    case 'large':
      return 28;
    case 'small':
      return 16;
    default:
      return 20;
  }
}

function getIconWithTextSize(size) {
  switch (size) {
    case 'large':
      return 28;
    case 'small':
      return 16;
    default:
      return 20;
  }
}

export function instanceOfIconOnly(object: any): object is IconOnlyButtonProps {
  return 'icon' in object && !('children' in object);
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    let icon;
    let iconPosition;
    let children;
    const { color, shape, size, textTransform, variant, ...rest } = props;

    const theme = React.useContext(ThemeContext);

    if (instanceOfIconOnly(props)) {
      icon = props.icon;
    } else {
      icon = props.icon;
      iconPosition = props.iconPosition;
      children = props.children;
    }

    const other = omit(['iconPosition', 'textPosition'], rest);

    if (icon && !children) {
      return (
        <StyledButton
          {...other}
          ref={ref}
          color={color ? color : ButtonColor.primary}
          iconOnly
          shape={shape ? shape : ButtonShape.round}
          size={size ? size : ButtonSize.medium}
          variant={variant ? variant : ButtonVariant.solid}
        >
          {React.Children.only(
            React.cloneElement(icon, {
              size: icon.props.size ? icon.props.size : getIconSize(size),
            })
          )}
        </StyledButton>
      );
    }
    return (
      <StyledButton
        {...other}
        ref={ref}
        color={color ? color : ButtonColor.primary}
        shape={shape ? shape : ButtonShape.fill}
        size={size ? size : ButtonSize.medium}
        textTransform={
          textTransform ? textTransform : ButtonTextTransform.uppercase
        }
        variant={variant ? variant : ButtonVariant.solid}
      >
        {iconPosition === ButtonIconPosition.right && (
          <SpanTextLeft size={size} theme={theme}>
            {children}{' '}
          </SpanTextLeft>
        )}
        {React.Children.only(
          React.cloneElement(icon, {
            size: icon.props.size ? icon.props.size : getIconWithTextSize(size),
          })
        )}
        {iconPosition !== ButtonIconPosition.right && (
          <SpanTextRight size={size} theme={theme}>
            {children}
          </SpanTextRight>
        )}
      </StyledButton>
    );
  }
);
