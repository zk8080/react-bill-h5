import { useCallback, useEffect, useState } from 'react';
import { Icon, Keyboard, Popup } from 'zarm';
import type { PopupProps } from 'zarm/lib/popup/Popup';
import classNames from 'classnames';
import style from './style.module.less';
import PopupDate from '../PopupDate';
import dayjs from 'dayjs';
import { http } from '@/utils/axios';
import { FilterType } from 'global';
import CustomIcon from '../CustomIcon';
import { TypeKey, typeMap } from '@/utils';

type IProps = PopupProps & {

}

type PayType = 'expense' | 'income'

const PopupAddBill = (props: IProps) => {
  const { visible, onMaskClick } = props;

  const [payType, setPayType] = useState<PayType>('expense'); // 支出或收入类型
  const [addDate, setAddDate] = useState<string>(dayjs().format('MM-DD')); // 新增日期
  const [dateVisible, setDateVisible] = useState<boolean>(false); // 日期弹窗
  const [amount, setAmount] = useState<string>(''); // 金额
  const [currentType, setCurrentType] = useState<FilterType | undefined>(); // 当前选中账单类型
  const [expense, setExpense] = useState<FilterType[]>([]); // 支出类型数组
  const [income, setIncome] = useState<FilterType[]>([]); // 收入类型数组

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

  useEffect(() => {
    const getTypeList = async () => {
      const { data: { list } } = await http.get<{list: FilterType[]}>('/type/list');
      const _expense = list.filter(i => i.type === '1'); // 支出类型
      const _income = list.filter(i => i.type === '2'); // 收入类型
      setExpense(_expense);
      setIncome(_income);
      setCurrentType(_expense[0]); // 新建账单，类型默认是支出类型数组的第一项
    }

    getTypeList();
  }, [])

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
      <div className={style.typeWarp}>
      <div className={style.typeBody}>
        {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
        {
          (payType == 'expense' ? expense : income).map(item => <div onClick={() => setCurrentType(item)} key={item.id} className={style.typeItem}>
            {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
            <span className={classNames({[style.iconfontWrap]: true, [style.expense]: payType == 'expense', [style.income]: payType == 'income', [style.active]: currentType?.id == item.id})}>                
              <CustomIcon className={style.iconfont} type={typeMap[Number(item.id) as TypeKey].icon} />
            </span>
            <span>{item.name}</span>
          </div>)
        }
      </div>
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