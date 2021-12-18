import React, { Fragment, useEffect, useState } from "react";
import { FilePicker, Button, Toast, Input } from "zarm";
import { http } from "@/utils/axios";
import style from "./style.module.less";
import Header from "@/components/Header";
import { UserInfoType } from "../../../global.d";
import { useNavigate } from "react-router-dom";

interface FileType {
  file: File;
  fileType: string;
  fileSize: number;
  fileName: string;
  thumbnail: string;
}

function UserInfo() {
  const navigate = useNavigate();
  // 头像
  const [avatar, setAvatar] = useState<string>("");
  // 个性签名
  const [signature, setSignature] = useState<string>();

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const { data, code } = await http.get<UserInfoType>('/user/get_userinfo');
      if(code === 200) {
        setAvatar(data.avatar);
        setSignature(data.signature);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 选择文件
  const handleSelect = async (
    fileObj?: Partial<FileType> | Partial<FileType>[]
  ) => {
    try {
      console.log("file", fileObj);
      const { file } = (fileObj as FileType) || {};
      if (!file) {
        return Toast.show("请选择图片");
      }
      // formData对象
      const formData = new FormData();
      formData.append("file", file);
      const res = await http.post<string>("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { code, data } = res;
      if (code === 200) {
        setAvatar(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 保存
  const handleSave = async () => {
    try{
      const { code } = await http.post('/user/edit_userinfo', {
        signature,
        avatar
      });
      if(code === 200) {
        Toast.show('修改成功')
        // 成功后回到个人中心页面
        navigate(-1);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <Fragment>
      <Header title="用户信息" />
      <div className={style.userinfo}>
        <h1>个人资料</h1>
        <div className={style.item}>
          <div className={style.title}>头像</div>
          <div className={style.avatar}>
            <img className={style.avatarUrl} src={avatar} alt="" />
            <div className={style.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker
                className={style.filePicker}
                onChange={handleSelect}
                accept="image/*"
              >
                <Button className={style.upload} theme="primary" size="xs">
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={style.item}>
          <div className={style.title}>个性签名</div>
          <div className={style.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value?: string) => setSignature(value)}
            />
          </div>
        </div>
        <Button onClick={handleSave} style={{ marginTop: 50 }} block theme="primary">
          保存
        </Button>
      </div>
    </Fragment>
  );
}

export default UserInfo;
