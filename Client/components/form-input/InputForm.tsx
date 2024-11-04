import React from "react";
import { InputGroupProps } from "@/types/type";
import styles from './inputForm.module.css';

const InputForm: React.FC<InputGroupProps> = ({
  label,
  type,
  id,
  name,
  placeholder,
  value,
  onChange,
}): JSX.Element => (
  <>
    <div className={styles.register_input_group}>
      <label htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
      />
    </div>
  </>
);

export default InputForm;
