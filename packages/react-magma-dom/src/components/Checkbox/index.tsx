import * as React from 'react';
import { ThemeContext } from '../../theme/ThemeContext';
import {
  DisplayInputStyles,
  DisplayInputActiveStyles,
  buildDisplayInputActiveBackground,
  buildDisplayInputBorderColor,
  buildDisplayInputFocusStyles,
} from '../SelectionControls/InputStyles';
import { FormGroupContext } from '../FormGroup';
import { HiddenStyles } from '../../utils/UtilityStyles';
import { InputMessage } from '../Input/InputMessage';
import { CheckIcon } from 'react-magma-icons';
import { StyledLabel } from '../SelectionControls/StyledLabel';
import { StyledContainer } from '../SelectionControls/StyledContainer';
import styled from '@emotion/styled';
import { omit, useGenerateId } from '../../utils';

export enum CheckboxTextPosition {
  left = 'left',
  right = 'right', // default
}

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * If true, element is checked (i.e. selected)
   * @default false
   */
  checked?: boolean;
  /**
   * Hex code for the background color
   * @default #0000FF
   */
  color?: string;
  /**
   * Style properties for the component container element
   */
  containerStyle?: React.CSSProperties;
  /**
   * If true, checkbox is checked on first render
   */
  defaultChecked?: boolean;
  /**
   * If true, element is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Content of the error message for an individual checkbox. If a value is provided, the input will be styled as an error state and the error message will display.
   */
  errorMessage?: React.ReactNode;
  /*
   * @internal
   */
  hasError?: boolean;
  /**
   * Style properties for the checkbox element
   */
  inputStyle?: React.CSSProperties;
  isInverse?: boolean;
  /**
   * If true, label text will be hidden visually, but will still be read by assistive technology
   * @default false
   */
  isTextVisuallyHidden?: boolean;
  /**
   * Style properties for the label element
   */
  labelStyle?: React.CSSProperties;
  /**
   * Content of label; can be node or string
   */
  labelText: React.ReactNode;
  testId?: string;
  /**
   * Whether the label appears to the left of the right of the checkbox
   * @default CheckboxTextPosition.right
   */
  textPosition?: CheckboxTextPosition;
}

export const HiddenLabelText = styled.span`
  ${HiddenStyles};
`;

export const HiddenInput = styled.input`
  ${HiddenStyles};
`;

export function buildCheckboxBackground(props) {
  if (props.isInverse) {
    if (
      (props.checked && !props.disabled) ||
      (props.isIndeterminate && !props.disabled)
    ) {
      return props.theme.colors.neutral08;
    }
    return 'none';
  }
  if (props.disabled) {
    return props.theme.colors.neutral06;
  }
  if (props.checked) {
    return props.color ? props.color : props.theme.colors.primary;
  }
  return props.theme.colors.neutral08;
}

export function buildCheckIconColor(props) {
  if (props.disabled) {
    return props.theme.colors.disabledText;
  }
  if (props.isInverse) {
    if (props.color) {
      return props.color;
    }
    return props.theme.colors.primary;
  }
  return props.theme.colors.neutral08;
}

export const StyledFakeInput = styled.span<{
  checked?: boolean;
  color: string;
  disabled?: boolean;
  isIndeterminate?: boolean;
  isInverse?: boolean;
  hasError?: boolean;
  textPosition?: CheckboxTextPosition;
  isTextVisuallyHidden?: boolean;
  theme?: any;
}>`
  ${DisplayInputStyles};
  background: ${props => buildCheckboxBackground(props)};
  border-color: ${props => buildDisplayInputBorderColor(props)};
  border-radius: 3px;
  box-shadow: ${props =>
    props.isInverse && props.hasError
      ? `0 0 0 1px ${props.theme.colors.neutral08}`
      : '0 0 0'};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  margin: ${props =>
    props.isTextVisuallyHidden
      ? '2px 0 0 0'
      : props.textPosition === 'left'
      ? '2px 0 0 10px'
      : '2px 10px 0 0'};
  svg {
    display: ${props => (props.checked ? 'block' : 'none')};
    fill: ${props => buildCheckIconColor(props)};
    opacity: ${props => (props.checked ? '1' : '0')};
    pointer-events: none;
    transition: all 0.2s ease-out;
  }

  ${HiddenInput}:focus + label & {
    &:before {
      ${props => buildDisplayInputFocusStyles(props)};
    }
  }

  &:after {
    // active state
    background: ${props => buildDisplayInputActiveBackground(props)};
  }

  /* prettier-ignore */
  ${HiddenInput}:not(:disabled):active + label & {
    &:after {
      ${DisplayInputActiveStyles}
    }
  }
`;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const { checked, id: defaultId, defaultChecked, onChange } = props;
    const [isChecked, updateIsChecked] = React.useState(
      Boolean(defaultChecked) || Boolean(checked)
    );

    const id = useGenerateId(defaultId);
    const isControlled = typeof checked === 'boolean' ? true : false;

    React.useEffect(() => {
      if (typeof checked === 'boolean') {
        updateIsChecked(checked);
      }
    }, [checked]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const { checked: targetChecked } = event.target;

      onChange && typeof onChange === 'function' && onChange(event);

      if (!isControlled) {
        updateIsChecked(targetChecked);
      }
    }

    const theme = React.useContext(ThemeContext);
    const context = React.useContext(FormGroupContext);

    const {
      color,
      containerStyle,
      disabled,
      errorMessage,
      inputStyle,
      isInverse,
      labelStyle,
      labelText,
      isTextVisuallyHidden,
      testId,
      textPosition,
      ...rest
    } = props;
    const other = omit(['defaultChecked'], rest);

    const descriptionId = errorMessage && `${id}__desc`;
    const groupDescriptionId = context.descriptionId;

    const describedBy =
      descriptionId && groupDescriptionId
        ? `${groupDescriptionId} ${descriptionId}`
        : descriptionId
        ? descriptionId
        : groupDescriptionId
        ? groupDescriptionId
        : null;

    const hasError = context.hasError || !!errorMessage;

    return (
      <>
        <StyledContainer style={containerStyle}>
          <HiddenInput
            {...other}
            aria-describedby={describedBy}
            id={id}
            data-testid={testId}
            checked={isChecked}
            disabled={disabled}
            ref={ref}
            type="checkbox"
            onChange={handleChange}
          />
          <StyledLabel htmlFor={id} isInverse={isInverse} style={labelStyle}>
            {!isTextVisuallyHidden &&
              textPosition === CheckboxTextPosition.left &&
              labelText}

            <StyledFakeInput
              checked={isChecked}
              color={color ? color : ''}
              disabled={disabled}
              hasError={hasError}
              isInverse={context.isInverse || isInverse}
              isTextVisuallyHidden={isTextVisuallyHidden}
              style={inputStyle}
              textPosition={textPosition}
              theme={theme}
            >
              <CheckIcon size={12} />
            </StyledFakeInput>

            {isTextVisuallyHidden ? (
              <HiddenLabelText>{labelText}</HiddenLabelText>
            ) : (
              textPosition !== CheckboxTextPosition.left &&
              labelText &&
              labelText
            )}
          </StyledLabel>
        </StyledContainer>
        {!!errorMessage && (
          <InputMessage id={descriptionId} hasError isInverse={isInverse}>
            {errorMessage}
          </InputMessage>
        )}
      </>
    );
  }
);
