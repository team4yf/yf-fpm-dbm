# 2.0.5 (2017-03-01)

Feature

- support Object type Condition

Code:

- reCode the fastDBM.js srouce file

Test:

- add More Test Script File.

# 2.0.4 (2017-02-20)

Feature

- release the connection after commit / rollback

# 2.0.3 (2017-02-19)

Feature

- support transaction


# 2.0.2 (2017-02-05)

Fixbugs

- ReferenceError: err is not defined

```bash
ReferenceError: err is not defined
    at Query._callback (F:\FPM\yf-server\server\node_modules\.2.0.1@yf-fpm-dbm\lib\fastDBM.js:226:18)
    at Query.Sequence.end (F:\FPM\yf-server\server\node_modules\.2.13.0@mysql\lib\protocol\sequences\Sequence.js:86:24)
    at Query.ErrorPacket (F:\FPM\yf-server\server\node_modules\.2.13.0@mysql\lib\protocol\sequences\Query.js:88:8)
    at Protocol._parsePacket (F:\FPM\yf-server\server\node_modules\.2.13.0@mysql\lib\protocol\Protocol.js:280:23)
    at Parser.write (F:\FPM\yf-server\server\node_modules\.2.13.0@mysql\lib\protocol\Parser.js:75:12)
    at Protocol.write (F:\FPM\yf-server\server\node_modules\.2.13.0@mysql\lib\protocol\Protocol.js:39:16)
    at Socket.<anonymous> (F:\FPM\yf-server\server\node_modules\.2.13.0@mysql\lib\Connection.js:103:28)
    at emitOne (events.js:96:13)
    at Socket.emit (events.js:188:7)
    at readableAddChunk (_stream_readable.js:176:18)
    at Socket.Readable.push (_stream_readable.js:134:10)
    at TCP.onread (net.js:548:20)
```

Bug: lib\fastDBM.js line:226

before:

```javascript
 cb(err);
```

after:

```javascript
 cb(err2);
```

# 2.0.1 (2016-12-12)

1.移除 Q 模块，将所有函数使用标准库中的回调函数模式
2.添加 bluebird 模块。
