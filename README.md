# knoQ-UI

## 開発
### 必要要件
- node.js
- yarn

### UIの起動
```shell
$ yarn
$ yarn serve
```

### knoQサーバーと連携して実際に動作をテストする
1. [knoQサーバー](https://github.com/traPtitech/knoQ)のリポジトリを適当なところにcloneし，開発用サーバーを起動する．knoQサーバーの起動に必要な要件については[ここ](https://github.com/traPtitech/knoQ#%E5%BF%85%E8%A6%81%E8%A6%81%E4%BB%B6)を参照．
```shell
$ git clone https://github.com/traPtitech/knoQ.git
$ cd knoQ

$ cd development
$ make init
$ docker-compose up -d
```
2. UIを起動していないなら起動する
3. ブラウザで http://localhost:6006 を開く
4. traQのOAuthの許可を求められるので，許可ボタンをおす．
5. knoQのページに戻ったら，http://localhost:8080 を開く．
