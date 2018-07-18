#!/bin/sh

#
#使用方法：1.mmall -> front_deploy.sh mmall_fe
#         2.admin -> front_deploy.sh admin_fe
#
GIT_HOME=/developer/git-repository/
DIST_PATH=/product/frontend/


#
# 1.cd dir
#
if [ ! -n "$1" ];
    then
    echo -e "请输入要发布的项目！"
    exit
fi

if [ $1 = "mmall_fe" ];
    then
    echo -e "===========Enter mmall_fe=========="
    cd $GIT_HOME$1

elif [ $1 = "admin_fe" ]
    then
    echo -e "===========Enter admin_fe=========="
    cd $GIT_HOME$1

else
    echo -e "输入的项目没有找到!"
    exit
fi


# 注意：需确认服务器当前用户是否需要使用“sudo”权限，
# 可以使用命令“sudo chown -R username /developer”来修改当前用户对相应文件夹的所有权
#
# 2.clear git dist
#
echo -e "===========Clear Git Dist=========="
rm -rf ./dist


#
# 3.git 操作
#
echo -e "======git checkout mmall_v1.0======"
sudo git checkout mmall_v1.0

echo -e "==============git fetch============"
sudo git fetch

echo -e "==============git pull============="
sudo git pull


#
# 4.npm install & webpack
#
echo -e "============npm install============"
npm install --registry=https://registry.npm.taobao.org

# npm run dist
echo -e "============npm run dist==========="
npm run dist


#
#5.copy & result
#
if [ -d "./dist" ]
    then
    # backup dist
    echo -e "============dist backup============"
    mv $DIST_PATH$1/dist $DIST_PATH$1/dist.backup

    # copy dist
    echo -e "============copy dist=============="
    cp -R ./dist $DIST_PATH$1

    # echo result
    echo -e "===========Deploy Success=========="
else
    echo -e "===========Deploy Error============"
fi
