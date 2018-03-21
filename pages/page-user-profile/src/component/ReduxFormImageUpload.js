import React from 'react';
import ImageUpload from '@jcmap/component-image-upload';


export default function ReduxFormImageUpload({ input }) {
  return (
    <ImageUpload fieldName={input.name} {...input} />
  );
}
