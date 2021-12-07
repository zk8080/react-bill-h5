import { useCallback, useEffect, useState } from 'react';
import { Icon, Popup } from 'zarm';
import type { PopupProps } from 'zarm/types/popup/Popup';
import classNames from 'classnames';
import style from './style.module.less';
import PopupDate from '../PopupDate';
import dayjs from 'dayjs';

type IProps = PopupProps & {

}

type PayType = 'expense' | 'income'

const PopupAddBill = (props: IProps) => {
  const { visible, onMaskClick } = props;

  const [payType, setPayType] = useState<PayType>('expense'); // 支出或收入类型
  const [addDate, setAddDate] = useState<string>(dayjs().format('MM-DD')); // 新增日期
  const [dateVisible, setDateVisible] = useState<boolean>(false); // 日期弹窗

  // 选择类型
  const changeType = (type: PayType) => {
    setPayType(type);
  }

  // 切换日期弹窗
  const toggleDate = useCallback(() => {
    setDateVisible(!dateVisible)
  }, [dateVisible])

  // 选择日期
  const handleDateChange = (date: string) => {
    setAddDate(date);
  }

  return <Popup
    visible={visible}
    direction="bottom"
    onMaskClick={onMaskClick}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div className={style.addWrap}>
      {/* 右上角关闭弹窗 */}
      <header className={style.header}>
        <span className={style.close} onClick={onMaskClick}><Icon type="wrong" /></span>
      </header>
       {/* 「收入」和「支出」类型切换 */}
      <div className={style.filter}>
        <div className={style.type}>
          <span onClick={() => changeType('expense')} className={classNames({ [style.expense]: true, [style.active]: payType == 'expense' })}>支出</span>
          <span onClick={() => changeType('income')} className={classNames({ [style.income]: true, [style.active]: payType == 'income' })}>收入</span>
        </div>
        <div
          className={style.time}
          onClick={toggleDate}
        >{addDate} <Icon className={style.arrow} type="arrow-bottom" /></div>
      </div>
    </div>
    <PopupDate
      mode="date"
      visible={dateVisible}
      onSelect={handleDateChange}
      onMaskClick={toggleDate}
    />
  </Popup>
}

export default PopupAddBill