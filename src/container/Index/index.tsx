import { BillItemType, FilterType } from '../../../global';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon, Pull } from 'zarm'
import style from './style.module.less';
import BillItem from '@/components/BillItem';
import { http } from '@/utils/axios';
import { REFRESH_STATE, LOAD_STATE } from '@/utils' // Pull 组件需要的一些常量
import dayjs from 'dayjs';
import PopupType, { TypeRefObj } from '@/components/PopupType';
import CustomIcon from '@/components/CustomIcon';
import PopupDate from '@/components/PopupDate';

interface BillListResType {
  list: BillItemType[],
  totalExpense: number,
  totalIncome: number,
  totalPage: number,
}


function Index() {

  // 筛选类型弹窗Ref
  const typeRef = useRef<TypeRefObj>(null);

  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')); // 当前筛选时间
  const [page, setPage] = useState<number>(1); // 分页
  const [list, setList] = useState<BillItemType[]>([]); // 账单列表
  const [totalPage, setTotalPage] = useState<number>(0); // 分页总数
  const [refreshing, setRefreshing] = useState<number>(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState<number>(LOAD_STATE.normal); // 上拉加载状态
  const [currentSelect, setCurrentSelect] = useState<FilterType>({ id: 'all', name: '全部类型' }); // 当前筛选类型
  const [dateVisible, setDateVisible] = useState<boolean>(false); // 日期选择窗
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入

  // 切换日期弹窗
  const toggleDate = useCallback(() => {
    setDateVisible(!dateVisible);
  }, [dateVisible])

  // 获取账单方法
  const getBillList = async () => {
    const { data } = await http.get<BillListResType>(`/bill/list`, {
      params: {
        page,
        page_size: 5,
        date: currentTime,
        type_id: currentSelect.id || 'all'
      }
    });
    // 下拉刷新，重制数据
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalExpense(parseFloat(data.totalExpense.toFixed(2)));
    setTotalIncome(parseFloat(data.totalIncome.toFixed(2)));
    setTotalPage(data.totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  // 切换类型弹窗
  const toggleType = () => {
    typeRef.current?.show();
  }

  // 选中类型
  const handleSelectType = (item: FilterType) => {
    setRefreshing(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重制为 1
    setPage(1);
    setCurrentSelect(item);
  }

  // 筛选月份
  const selectMonth = (item: string) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  }

  useEffect(() => {
    getBillList();
  }, [page, currentSelect.id, currentTime])

  return <div className={style.home}>
    <div className={style.header}>
      <div className={style.dataWrap}>
        <span className={style.expense}>总支出：<b>¥ {totalExpense}</b></span>
        <span className={style.income}>总收入：<b>¥ {totalIncome}</b></span>
      </div>
      <div className={style.typeWrap}>
        <div className={style.left}>
          <span
            className={style.title}
            onClick={toggleType}
          >
            {currentSelect.name || '全部类型'}
            <Icon className={style.arrow} type="arrow-bottom" />
          </span>
        </div>
        <div className={style.right}>
          <span 
            className={style.time}
            onClick={toggleDate}
          >
            {currentTime}
            <Icon className={style.arrow} type="arrow-bottom" />
          </span>
        </div>
      </div>
    </div>
    <div className={style.contentWrap}>
      {
        list.length > 0 && (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => <BillItem key={item.date} bill={item} />)
            }
          </Pull>
        )
      }

    </div>
    <div className={style.add}><CustomIcon type='tianjia'/></div>
    <PopupType
      ref={typeRef}
      onSelect={handleSelectType}
    />
    <PopupDate
      visible={dateVisible}
      onSelect={selectMonth}
      onClose={toggleDate}
      mode="month"
    />
  </div>
}

export default Index;