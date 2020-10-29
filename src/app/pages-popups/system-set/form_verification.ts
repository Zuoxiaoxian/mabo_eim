// 主要是针对弹窗窗口中的表单进行验证！

// 官方默认的有：required(必填)、phone(手机号)、email(邮箱)、url(网址)、number(数字)、date(日期)、identity(身份证)

/*
1、新增、编辑 用户
    账号 验证：employeeno character(20)
    用户名称 验证：name character(100)
    登录名称 验证：loginname character(50)
    邮箱 验证：email character(50)

*/

export const AddEmployee =  {
    employeeno: "^[a-zA-Z0-9_]{1,20}$",       // 数字、字母、_ 
    name: "^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]{1,100}$",  // 数字、字母、中文
    loginname: "^[a-zA-Z0-9_@.]{1,50}$",       //数字、字母、_ 

}

/*
2、添加、编辑 菜单
*/

export const AddMenu =  {
    muluname: "^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]{1,255}$",       // 数字、字母、_ 、中文
    muluname_en: "^[a-zA-Z0-9_]{1,255}$",  // 数字、字母、_ 组成的字符串

    caidanname: "^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]{1,255}$", // 数字、字母、_ 、中文
    caidanname_en: "^[a-zA-Z0-9_]{1,255}$",  // 数字、字母、_组成的字符串

    anniuname: "^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]{1,255}$", // 数字、字母、_ 、中文
    anniuname_en: "^[a-zA-Z0-9_ ]{1,255}$",  // 数字、字母、_组成的字符串
}


/*
3、添加、编辑 角色
*/

export const AddRole =  {
    role_name: "^[\u4e00-\u9fa5\\s·]{1,255}$",       // 数字、字母、_ 、中文
    role: "^[a-zA-Z0-9_]{1,255}$",  // 数字、字母、_ 组成的字符串
}

/*
4、添加、编辑 用户组

*/

export const EmployeeGroup =  {
    group_name: "^[a-zA-Z0-9_]{1,20}$",       // 数字、字母、_ 
    group_: "^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]{1,100}$",  // 数字、字母、中文
}






