import React from 'react';

import { Heading } from 'react-magma-dom';
import { FormTemplateRenderProps } from '@data-driven-forms/react-form-renderer';

export const BasicTemplate = ({
  formFields,
  schema,
}: FormTemplateRenderProps) => {
  return (
    <div>
      {formFields}
    </div>
  );
};
