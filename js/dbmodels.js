var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://datas:prf34NAZ6AwP@127.0.0.1:5543/datas');
var MCrypt = require('mcrypt').MCrypt;
var Sync = require('sync'); // https://github.com/ybogdanov/node-sync


var LectureState = sequelize.define('student_lecture_states', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true

  },
  id_lecture: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  state_header: {
    type: Sequelize.STRING
  },
  state_items: {
      type: Sequelize.STRING
  },
  createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
  },
  updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
  }
});

var LectureBlock = sequelize.define('student_lecture_blocks', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_lecture: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },

    id_block: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.CHAR()
    },
    state: {
        type: Sequelize.CHAR()
    },
    private: {
        type: Sequelize.INTEGER
    },
    body: {
        type: Sequelize.BLOB('medium')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
}, {
    timestamps: false
});

var Registry = sequelize.define('registry', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sub_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    item: {
        type: Sequelize.CHAR()
    },
    value: {
        type: Sequelize.TEXT
    },
    up_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
},{
    timestamps: false,
    freezeTableName: true
});

var getRegistry = function (value) {
    return Registry.findOne({
        where: {item: value},
        attributes: ['value']}).then(function (result) {
        return result.value;
    });
};

function Decode(value,key) {
    var desEcb = new MCrypt('rijndael-256', 'ecb');
    desEcb.open(key);
    return desEcb.decrypt(new Buffer(value, 'base64')).toString();
}

function asyncFunction(a, b, callback) {
    process.nextTick(function(){
        callback(null, a + b);
    })
};

function asyncGetRegistry(value,callback) {
    process.nextTick(function() {
        Registry.findOne({
        where: {item: value},
        attributes: ['value']}).then(function (result) {
            callback(null,result.value);
        });
    })
}

module.exports.LectureState = LectureState;
module.exports.LectureBlock = LectureBlock;
module.exports.Registry = Registry;
module.exports.Decode = Decode;
module.exports.getRegistry = getRegistry;
module.exports.asyncGetRegistry = asyncGetRegistry;
module.exports.Sync = Sync;
