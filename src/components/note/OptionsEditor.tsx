import { useState } from 'react';
import ToggleButton from '../ToggleButton';

export default function OptionsEditor() {
  const [value, setValue] = useState(false);
  return (
    <div>
      <ToggleButton
        toggleValue={value}
        setToggleValue={(val: boolean) => {
          setValue(val);
        }}
      />
    </div>
  );
}
