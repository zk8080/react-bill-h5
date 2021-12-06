import { forwardRef, useState } from 'react';
import style from './style.module.less';
import { Popup, DatePicker  } from 'zarm';
import dayjs from 'dayjs';

type IProps = {
  onSelect: (date: string) => void;
  mode?: string;
  visible: boolean;
  onClose?: () => void;
}

const PopupDate = (props: IProps) => {
  const { onSelect, mode = 'date', visible, onClose } = props;
  const [now, setNow] = useState(new Date())

  const choseMonth = (item: Date) => {
    setNow(item)
    if (mode == 'month') {
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if (mode == 'date') {
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
    onClose?.();
  }

  return <Popup
    visible={visible}
    direction="bottom"
    onMaskClick={onClose}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div>
      <DatePicker
        visible={visible}
        value={now}
        mode={mode}
        onOk={choseMonth}
        onCancel={onClose}
      />
    </div>
  </Popup>
};

export default PopupDate;