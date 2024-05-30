import * as React from 'react';

const InputWithLabel = ({ id, value, type = 'text', onInputChange, isFocused, children, }) => (
    <>
      <label htmlFor={id} className='label'>{children}</label>
      &nbsp;
      <input
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
        className='input'
      />
    </>
);

export { InputWithLabel };