import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Icon, Progress } from 'zarm';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { http } from '@/utils/axios'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import style from './style.module.less';
import { typeMap, TypeKey } from '@/utils';
import type { PayType } from '../../../global';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsType } from 'echarts/types/dist/shared';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;

interface DataItem {
  number: number;
  pay_type: number;
  type_id: number;
  type_name: string;
}

interface ResDataType {
  total_income: string;
  total_expense: string;
  total_data: DataItem[];
}

const Data = () => {
  const [curDate, setCurDate] = useState<string>(dayjs().format('YYYY-MM')); // 当前日期
  const [totalType, setTotalType] = useState<PayType>('expense'); // 收入或支出类型
  const [totalExpense, setTotalExpense] = useState<string>('0'); // 总支出
  const [totalIncome, setTotalIncome] = useState<string>('0'); // 总收入
  const [expenseData, setExpenseData] = useState<DataItem[]>([]); // 支出数据
  const [incomeData, setIncomeData] = useState<DataItem[]>([]); // 收入数据
  const [visible, setVisible] = useState<boolean>(false); // 日期弹窗
  const [pieType, setPieType] = useState<PayType>('expense'); // 饼图的「收入」和「支出」控制

  // echarts实例
  const pipChartRef = useRef<EChartsType>();
  // 切换日期弹窗
  const toggleVisible = useCallback(() => {
    setVisible(!visible);
  }, [visible])

  // 选择日期
  const handleSelect = (date: string) => {
    setCurDate(date);
  }

  // 切换收支类型
  const changeTotalType = (type: PayType) => {
    setTotalType(type);
  }

  // 绘制饼图方法
  const setPieChart = (data: DataItem[]) => {
    const echartDom = document.getElementById('proportion');
    if (echartDom) {
      // 初始化饼图，返回实例。
      pipChartRef.current = echarts.init(echartDom);
      // 饼图配置参数
      const option: EChartsOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 图例
        legend: {
          data: data.map(item => item.type_name)
        },
        series: [
          {
            name: '支出',
            type: 'pie',
            radius: '55%',
            data: data.map(item => {
              return {
                value: item.number,
                name: item.type_name
              }
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      pipChartRef.current?.setOption(option);
    };
  };

  // 切换饼图收支类型
  const changePieType = (type: PayType) => {
    setPieType(type);
    // 重绘饼图
    setPieChart(type == 'expense' ? expenseData : incomeData);
  }

  // 获取数据详情
  const getData = async () => {
    const { data } = await http.get<ResDataType>(`/bill/data?date=${curDate}`);

    // 总收支
    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);

    // 过滤支出和收入
    const expense_data = data.total_data.filter(item => item.pay_type == 1).sort((a, b) => b.number - a.number); // 过滤出账单类型为支出的项
    const income_data = data.total_data.filter(item => item.pay_type == 2).sort((a, b) => b.number - a.number); // 过滤出账单类型为收入的项
    setExpenseData(expense_data);
    setIncomeData(income_data);
    // 绘制饼图
    setPieChart(pieType == 'expense' ? expense_data : income_data);
  };

  useEffect(() => {
    getData();
    return  () => {
      // 组件卸载释放饼图实例
      pipChartRef.current?.dispose();
    }
  }, [curDate])

  return <div className={style.data}>
    <div className={style.total}>
      <div
        className={style.time}
        onClick={toggleVisible}
      >
        <span>{curDate}</span>
        <Icon className={style.date} type="date" />
      </div>
      <div className={style.title}>共支出</div>
      <div className={style.expense}>¥ {totalExpense}</div>
      <div className={style.income}>共收入¥ {totalIncome}</div>
    </div>
    <div className={style.structure}>
      <div className={style.head}>
        <span className={style.title}>收支构成</span>
        <div className={style.tab}>
          <span onClick={() => changeTotalType('expense')} className={classNames({ [style.expense]: true, [style.active]: totalType == 'expense' })}>支出</span>
          <span onClick={() => changeTotalType('income')} className={classNames({ [style.income]: true, [style.active]: totalType == 'income' })}>收入</span>
        </div>
      </div>
      <div className={style.content}>
        {
          (totalType == 'expense' ? expenseData : incomeData).map(item => <div key={item.type_id} className={style.item}>
            <div className={style.left}>
              <div className={style.type}>
                <span className={classNames({ [style.expense]: totalType == 'expense', [style.income]: totalType == 'income' })}>
                  <CustomIcon
                    type={item.type_id ? typeMap[item.type_id as TypeKey].icon : '1'}
                  />
                </span>
                <span className={style.name}>{item.type_name}</span>
              </div>
              <div className={style.progress}>¥{Number(item.number).toFixed(2) || 0}</div>
            </div>
            <div className={style.right}>
              <div className={style.percent}>
                <Progress
                  shape="line"
                  percent={Number(Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2))}
                  theme='primary'
                />
              </div>
            </div>
          </div>)
        }
      </div>
    </div>
    <div className={style.structure}>
      <div className={style.proportion}>
        <div className={style.head}>
          <span className={style.title}>收支构成</span>
          <div className={style.tab}>
            <span onClick={() => changePieType('expense')} className={classNames({ [style.expense]: true, [style.active]: pieType == 'expense' })}>支出</span>
            <span onClick={() => changePieType('income')} className={classNames({ [style.income]: true, [style.active]: pieType == 'income' })}>收入</span>
          </div>
        </div>
        {/* 这是用于放置饼图的 DOM 节点 */}
        <div id="proportion"></div>
      </div>
    </div>
    <PopupDate
      visible={visible}
      onMaskClick={toggleVisible}
      onSelect={handleSelect}
      mode="month"
    />
  </div>
}

export default Data;