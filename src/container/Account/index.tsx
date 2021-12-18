import React, { FC } from 'react';
import { Cell, Input, Button, Toast } from 'zarm';
import { createForm, FormType, ValidateErrors, ValidateValues } from 'rc-form';
import Header from '@/components/Header';
import { http } from '@/utils/axios';

import style from './style.module.less'

interface IProps {
  // 自定义rc-form类型
  form: FormType
}

const Account: FC<IProps> = (props) => {
  // Account 通过 createForm 高阶组件包裹之后，可以在 props 中获取到 form 属性
  const { getFieldProps, validateFields } = props.form;

  // 提交修改方法
  const handleSubmit = () => {
    // validateFields 获取表单属性元素
    validateFields(async (error: ValidateErrors, value: ValidateValues) => {
      try {
        // error 表单验证全部通过，为 false，否则为 true
        if (!error) {
          console.log(value)
          if (value.newpass != value.newpass2) {
            Toast.show('新密码输入不一致');
            return
          }
          const res = await http.post('/user/modify_pass', {
            old_pass: value.oldpass,
            new_pass: value.newpass,
            new_pass2: value.newpass2
          })
          if(res.code === 200) {
            Toast.show('修改成功');
          }
        } else {
          const errorMsg = Object.values(error)[0]?.errors[0]?.message;
          if(errorMsg) {
            Toast.show(errorMsg);
          }
        }
      } catch (e) {
        console.log(e)
      }
    });
  }

  return <>
    <Header title="重制密码" />
    <div className={style.account}>
      <div className={style.form}>
        <Cell title="原密码">
          <Input
            clearable
            type="text"
            placeholder="请输入原密码"
            {...getFieldProps('oldpass', { rules: [{ required: true, message: '请填写原密码！' }] })}
          />
        </Cell>
        <Cell title="新密码">
          <Input
            clearable
            type="text"
            placeholder="请输入新密码"
            {...getFieldProps('newpass', { rules: [{ required: true,  message: '请填写新密码！' }] })}
          />
        </Cell>
        <Cell title="确认密码">
          <Input
            clearable
            type="text"
            placeholder="请再此输入新密码确认"
            {...getFieldProps('newpass2', { rules: [{ required: true,  message: '请再次填写原密码！' }] })}
          />
        </Cell>
      </div>
      <Button className={style.btn} block theme="primary" onClick={handleSubmit}>提交</Button>
    </div>
  </>
};

export default createForm()(Account);