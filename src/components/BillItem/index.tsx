import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Cell } from 'zarm';
import { useNavigate } from 'react-router-dom'
import CustomIcon from '../CustomIcon';
import { typeMap, TypeKey } from '@/utils';
import style from './style.module.less';
import type { BillType, BillItemType } from '../../../global.d';

type IProps = {
  bill: BillItemType
}

const BillItem = (props: IProps) => {
  const { bill } = props;
  const [income, setIncome] = useState(0); // 收入
  const [expense, setExpense] = useState(0); // 支出
  // const history = useHistory(); // 路由实例
  const navigate = useNavigate();

  // 当添加账单是，bill.bills 长度变化，触发当日收支总和计算。
  useEffect(() => {
    // 初始化将传入的 bill 内的 bills 数组内数据项，过滤出支出和收入。
    // pay_type：1 为支出；2 为收入
    // 通过 reduce 累加
    const _income = bill.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
    const _expense = bill.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
  }, [bill.bills?.length]);

  // 前往账单详情
  const goToDetail = (item: BillType) => {
    navigate(`/detail?id=${item.id}`)
  };

  return <div className={style.item}>
    <div className={style.headerDate}>
      <div className={style.date}>{dayjs(bill.date).format('YYYY-MM-DD')}</div>
      <div className={style.money}>
        <span>
          <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt='支' />
            <span>¥{ expense.toFixed(2) }</span>
        </span>
        <span>
          <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
          <span>¥{ income.toFixed(2) }</span>
        </span>
      </div>
    </div>
    {
      bill && bill.bills.map(item => <Cell
        className={style.bill}
        key={item.id}
        onClick={() => goToDetail(item)}
        title={
          <>
            <CustomIcon
              className={style.itemIcon}
              type={item.type_id ? typeMap[item.type_id as TypeKey].icon : undefined}
            />
            <span>{ item.type_name }</span>
          </>
        }
        description={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>}
        help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
      >
      </Cell>)
    }
  </div>
};

export default BillItem;