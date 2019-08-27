# linux-systemd

Systemd wrapper

- [linux-systemd](#linux-systemd)
	- [Available functions](#available-functions)
		- [systemd](#systemd)
		- [listNames](#listnames)
		- [list](#list)
		- [exists](#exists)
		- [basicInformations](#basicinformations)
		- [detailedInformations](#detailedinformations)
		- [loadState](#loadstate)
		- [activeState](#activestate)
		- [unitFileState](#unitfilestate)
		- [start](#start)
		- [stop](#stop)
		- [restart](#restart)
		- [enable](#enable)
		- [disable](#disable)
		- [mask](#mask)
		- [unmask](#unmask)

## Available functions

### systemd

Returns a Systemd object.

```javascript
var systemd = require("linux-systemd").systemd;

var sysd = systemd();
```

### listNames

Retrieves a list containing the services name.

```javascript
var listNames = require("linux-systemd").listNames;

listNames()
  .then(names => {
    console.log(names);
  })
  .catch(e => {
    console.error(e);
  });

listNames((error, names) => {
  if (error) {
    console.error(error);
  } else {
    console.log(names);
  }
});
```

### list

Retrieves a list containing the services basic informations.

- name
- description
- loadState
- activeState
- subState
- unitFileState

```javascript
var list = require("linux-systemd").list;

list()
  .then(informations => {
    console.log(informations);
  })
  .catch(e => {
    console.error(e);
  });

list((error, informations) => {
  if (error) {
    console.error(error);
  } else {
    console.log(informations);
  }
});
```

### exists

Checks if a service name exists.

```javascript
var exists = require("linux-systemd").exists;

exists("sshd")
  .then(exists => {
    if (exists) {
      console.log("The service sshd exists");
    } else {
      console.log("The service sshd doesn't exists");
    }
  })
  .catch(e => {
    console.error(e);
  });

exists("sshd", (error, exists) => {
  if (error) {
    console.error(e);
  } else {
    if (exists) {
      console.log("The service sshd exists");
    } else {
      console.log("The service sshd doesn't exists");
    }
  }
});
```

### basicInformations

Retrieves the basic informations of a service.

```javascript
var basicInformations = require("linux-systemd").basicInformations;

basicInformations("sshd")
  .then(informations => {
    console.log(informations);
  })
  .catch(e => {
    console.error(e);
  });

basicInformations("sshd", (error, informations) => {
  if (error) {
    console.error(e);
  } else {
    console.log(informations);
  }
});
```

### detailedInformations

Retrieves the detailed informations of a service.

```javascript
var detailedInformations = require("linux-systemd").detailedInformations;

detailedInformations("sshd")
  .then(informations => {
    console.log(informations);
  })
  .catch(e => {
    console.error(e);
  });

detailedInformations("sshd", (error, informations) => {
  if (error) {
    console.error(e);
  } else {
    console.log(informations);
  }
});
```

### loadState

Retrieves the loadState of a service.

```javascript
var loadState = require("linux-systemd").loadState;

loadState("sshd")
  .then(state => {
    console.log(state);
  })
  .catch(e => {
    console.error(e);
  });

loadState("sshd", (error, state) => {
  if (error) {
    console.error(error);
  } else {
    console.log(state);
  }
});
```

### activeState

Retrieves the activeState of a service.

```javascript
var activeState = require("linux-systemd").activeState;

activeState("sshd")
  .then(state => {
    console.log(state);
  })
  .catch(e => {
    console.error(e);
  });

activeState("sshd", (error, state) => {
  if (error) {
    console.error(error);
  } else {
    console.log(state);
  }
});
```

### unitFileState

Retrieves the unitFileState of a service.

```javascript
var unitFileState = require("linux-systemd").unitFileState;

unitFileState("sshd")
  .then(state => {
    console.log(state);
  })
  .catch(e => {
    console.error(e);
  });

unitFileState("sshd", (error, state) => {
  if (error) {
    console.error(error);
  } else {
    console.log(state);
  }
});
```

### start

Starts a service.

```javascript
var start = require("linux-systemd").start;

start("sshd")
  .then(() => {
    console.log("The service sshd has been started");
  })
  .catch(e => {
    console.error("The service sshd hasn't been started:\n" + e);
  });

start("sshd", error => {
  if (error) {
    console.error("The service sshd hasn't been started:\n" + error);
  } else {
    console.log("The service sshd has been started");
  }
});
```

### stop

Stops a service.

```javascript
var stop = require("linux-systemd").stop;

stop("sshd")
  .then(() => {
    console.log("The service sshd has been stoped");
  })
  .catch(e => {
    console.error("The service sshd hasn't been stoped:\n" + e);
  });

stop("sshd", error => {
  if (error) {
    console.error("The service sshd hasn't been stoped:\n" + error);
  } else {
    console.log("The service sshd has been stoped");
  }
});
```

### restart

Restarts a service.

```javascript
var restart = require("linux-systemd").restart;

restart("sshd")
  .then(() => {
    console.log("The service sshd has been restarted");
  })
  .catch(e => {
    console.error("The service sshd hasn't been restarted:\n" + e);
  });

restart("sshd", error => {
  if (error) {
    console.error("The service sshd hasn't been restarted:\n" + error);
  } else {
    console.log("The service sshd has been restarted");
  }
});
```

### enable

Enables a service.

```javascript
var enable = require("linux-systemd").enable;

enable("sshd")
  .then(() => {
    console.log("The service sshd has been enabled");
  })
  .catch(e => {
    console.error("The service sshd hasn't been enabled:\n" + e);
  });

enable("sshd", error => {
  if (error) {
    console.error("The service sshd hasn't been enabled:\n" + error);
  } else {
    console.log("The service sshd has been enabled");
  }
});
```

### disable

Disables a service.

```javascript
var disable = require("linux-systemd").disable;

disable("sshd")
  .then(() => {
    console.log("The service sshd has been disabled");
  })
  .catch(e => {
    console.error("The service sshd hasn't been disabled:\n" + e);
  });

disable("sshd", error => {
  if (error) {
    console.error("The service sshd hasn't been disabled:\n" + error);
  } else {
    console.log("The service sshd has been disabled");
  }
});
```

### mask

Masks a service.

```javascript
var mask = require("linux-systemd").mask;

mask("sshd")
  .then(() => {
    console.log("The service sshd has been masked");
  })
  .catch(e => {
    console.error("The service sshd hasn't been masked:\n" + e);
  });

mask("sshd", error => {
  if (error) {
    console.error("The service sshd hasn't been masked:\n" + error);
  } else {
    console.log("The service sshd has been masked");
  }
});
```

### unmask

Unmasks a service.

```javascript
var unmask = require("linux-systemd").unmask;

unmask("sshd")
  .then(() => {
    console.log("The service sshd has been unmasked");
  })
  .catch(e => {
    console.error("The service sshd hasn't been unmasked:\n" + e);
  });

unmask("sshd", error => {
  if (error) {
    console.error("The service sshd hasn't been unmasked:\n" + error);
  } else {
    console.log("The service sshd has been unmasked");
  }
});
```
