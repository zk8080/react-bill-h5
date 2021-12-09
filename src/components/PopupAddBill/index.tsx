import { useCallback, useEffect, useState } from 'react';
import { Icon, Keyboard, Popup } from 'zarm';
import type { PopupProps } from 'zarm/lib/popup/Popup';
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
  const [amount, setAmount] = useState<string>('');

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

  // 监听输入框改变值
  const handleMoney = (value?: string) => {
    value = String(value)
    // 点击是删除按钮时
    if (value == 'delete') {
      let _amount = amount.slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }

    // 点击确认按钮时
    if (value == 'ok') {
      // 这里后续将处理添加账单逻辑
      return
    }

    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value == '.' && amount.includes('.')) return
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    // amount += value
    setAmount(amount + value)
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
      <div className={style.money}>
        <span className={style.sufix}>¥</span>
        <span className={classNames(style.amount, style.animation)}>{amount}</span>
      </div>
      <Keyboard type="price" onKeyClick={handleMoney} />
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