import { forwardRef, useState } from 'react';
import style from './style.module.less';
import { Popup, DatePicker  } from 'zarm';
import type { PopupProps } from 'zarm/lib/popup/Popup';
import dayjs from 'dayjs';

type IProps = PopupProps & {
  onSelect: (date: string) => void;
  mode?: 'month' | 'date';
}

const PopupDate = (props: IProps) => {
  const { onSelect, mode = 'date', visible, onMaskClick } = props;
  const [now, setNow] = useState(new Date())

  const choseMonth = (item: Date) => {
    setNow(item)
    if (mode === 'month') {
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if (mode === 'date') {
      onSelect(dayjs(item).format('MM-DD'))
    }
    onMaskClick?.();
  }

  return <Popup
    visible={visible}
    direction="bottom"
    onMaskClick={onMaskClick}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div>
      <DatePicker
        visible={visible}
        value={now}
        mode={mode}
        onOk={choseMonth}
        onCancel={onMaskClick}
      />
    </div>
  </Popup>
};

export default PopupDate;