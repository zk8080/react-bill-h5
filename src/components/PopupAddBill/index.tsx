import { useCallback, useEffect, useState } from 'react';
import { Icon, Input, Keyboard, Popup, Toast } from 'zarm';
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
  /**
   * 刷新数据回调
   */
  refreshLoad?: () => void;
}

type PayType = 'expense' | 'income'

const PopupAddBill = (props: IProps) => {
  const { visible, onMaskClick, refreshLoad } = props;

  const [payType, setPayType] = useState<PayType>('expense'); // 支出或收入类型
  const [addDate, setAddDate] = useState<string>(dayjs().format('YYYY-MM-DD')); // 新增日期
  const [dateVisible, setDateVisible] = useState<boolean>(false); // 日期弹窗
  const [amount, setAmount] = useState<string>(''); // 金额
  const [currentType, setCurrentType] = useState<FilterType | undefined>(); // 当前选中账单类型
  const [expense, setExpense] = useState<FilterType[]>([]); // 支出类型数组
  const [income, setIncome] = useState<FilterType[]>([]); // 收入类型数组
  const [remark, setRemark] = useState<string>(); // 备注
  const [showRemark, setShowRemark] = useState<boolean>(false); // 备注输入框展示控制

  // 选择类型
  const changeType = (type: PayType) => {
    setPayType(type);
    if(type === 'expense') {
      setCurrentType(expense[0]);
    }else {
      setCurrentType(income[0]);
    }
  }

  // 切换日期弹窗
  const toggleDate = useCallback(() => {
    setDateVisible(!dateVisible)
  }, [dateVisible])

  // 选择日期
  const handleDateChange = (date: string) => {
    setAddDate(date);
  }

  // 确定按钮
  const handleSubmit = async () => {
    try {
      if (!amount) {
        Toast.show('请输入具体金额');
        return
      }
      if(!currentType) {
        return Toast.show('请选择账单种类！');
      }
      const params = {
        amount: Number(amount).toFixed(2), // 账单金额小数点后保留两位
        type_id: currentType.id, // 账单种类id
        type_name: currentType.name, // 账单种类名称
        date: dayjs(addDate).unix() * 1000, // 日期传时间戳
        pay_type: payType == 'expense' ? 1 : 2, // 账单类型传 1 或 2
        remark: remark || '' // 备注
      }
      const res = await http.post('/bill/add', params);
      if(res.code === 200) {
        Toast.show('添加成功！');
        onMaskClick?.();
        refreshLoad?.();
        // 重制数据
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setAddDate(dayjs().format('YYYY-MM-DD'));
      setRemark('');
      }
    } catch(e) {
      console.log(e);
    }
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
      handleSubmit()
      return
    }

    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value == '.' && amount.includes('.')) return
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    // amount += value
    setAmount(amount + value)
  }

  // 切换备注输入框
  const toggleRemark = useCallback(() => {
    setShowRemark(!showRemark);
  }, [showRemark])

  useEffect(() => {
    const getTypeList = async () => {
      const { data: { list } } = await http.get<{ list: FilterType[] }>('/type/list');
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
        >{dayjs(addDate).format('MM-DD')} <Icon className={style.arrow} type="arrow-bottom" /></div>
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
              <span className={classNames({ [style.iconfontWrap]: true, [style.expense]: payType == 'expense', [style.income]: payType == 'income', [style.active]: currentType?.id == item.id })}>
                <CustomIcon className={style.iconfont} type={typeMap[Number(item.id) as TypeKey].icon} />
              </span>
              <span>{item.name}</span>
            </div>)
          }
        </div>
      </div>
      <div className={style.remark}>
        {
          showRemark ? <Input
            autoHeight
            showLength
            maxLength={50}
            type="text"
            rows={3}
            value={remark}
            placeholder="请输入备注信息"
            onChange={(val?: string) => setRemark(val)}
            onBlur={toggleRemark}
          /> : <span onClick={toggleRemark}>{remark || '添加备注'}</span>
        }
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