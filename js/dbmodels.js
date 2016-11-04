var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://datas:prf34NAZ6AwP@127.0.0.1:5543/datas');
var MCrypt = require('mcrypt').MCrypt;

var decrypt = function (encryptedMessage, encryptionMethod, secret, iv) {
    var decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
    return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8');
};


global.LectureState = sequelize.define('student_lecture_states', {
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

global.Registry = sequelize.define('registry', {
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

global.getRegistry = function (value) {
    return global.Registry.findOne({
        where: {item: value},
        attributes: ['value']}).then(function (result) {
        return result.value;
    });
};

global.Decode = function (value) {
    return global.getRegistry('module_crypt_key').then(function (secret) {
        var desEcb = new MCrypt('rijndael-256', 'ecb');     
        desEcb.open(secret);
        return desEcb.decrypt(new Buffer(value, 'base64')).toString();
    });
};
