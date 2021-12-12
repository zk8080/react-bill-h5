import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { http } from '@/utils/axios';
import classNames from 'classnames';
import CustomIcon from '@/components/CustomIcon';
import dayjs from 'dayjs';
import style from './style.module.less';
import { TypeKey, typeMap } from '@/utils';
import { Modal, Toast } from 'zarm';
import PopupAddBill, { DetailInfoType } from '@/components/PopupAddBill';

function Detail() {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const detailId = searchParams.get('id');
  // 详情数据
  const [detailInfo, setDetailInfo] = useState<DetailInfoType>();
  // 编辑弹窗
  const [visible, setVisible] = useState<boolean>(false);
  // 切换弹窗
  const toggleVisible = useCallback(() => {
    setVisible(!visible);
  }, [visible])
  const {
    pay_type,
    amount,
    type_id,
    type_name,
    date,
    remark
  } = detailInfo || {};

  const getDetail = async () => {
    try {
      const { data } = await http.get<DetailInfoType>(`/bill/detail`, {
        params: {
          id: detailId
        }
      });
      setDetailInfo(data);
    } catch (e) {
      console.log(e);
    }
  }

  // 删除方法
  const handleDelete = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onOk: async () => {
        try {
          const { code } = await http.post('/bill/delete', { id: detailId })
          if (code === 200) {
            Toast.show('删除成功')
            navigate(-1);
          }
        } catch (e) {
          console.log(e);
        }
      },
    });
  }

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <div className={style.detail}>
      <Header title='账单详情' />
      <div className={style.card}>
        <div className={style.type}>
          {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
          <span className={classNames({ [style.expense]: pay_type == 1, [style.income]: pay_type == 2 })}>
            {/* typeMap 是我们事先约定好的 icon 列表 */}
            <CustomIcon className={style.iconfont} type={type_id ? typeMap[type_id as TypeKey].icon : '1'} />
          </span>
          <span>{type_name || ''}</span>
        </div>
        {
          pay_type == 1
            ? <div className={classNames(style.amount, style.expense)}>-{amount}</div>
            : <div className={classNames(style.amount, style.incom)}>+{amount}</div>
        }
        <div className={style.info}>
          <div className={style.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(date)).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={style.remark}>
            <span>备注</span>
            <span>{remark || '-'}</span>
          </div>
        </div>
        <div className={style.operation}>
          <span onClick={handleDelete}><CustomIcon type='shanchu' />删除</span>
          <span onClick={toggleVisible}><CustomIcon type='tianjia' />编辑</span>
        </div>
      </div>
      <PopupAddBill
        visible={visible}
        onMaskClick={toggleVisible}
        detailInfo={detailInfo}
        refreshLoad={getDetail}
      />
    </div>
  )
}

export default Detail;