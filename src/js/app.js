App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load chores.
    $.getJSON('../chores.json', function(data) {
      var choresRow = $('#choresRow');
      var choresTemplate = $('#choresTemplate');

      for (i = 0; i < data.length; i ++) {
        choresTemplate.find('.panel-title').text(data[i].chore);
        choresTemplate.find('img').attr('src', data[i].picture);
        choresTemplate.find('.chore-rate').text(data[i].rate);
        choresTemplate.find('.age-range').text(data[i].age);
        choresTemplate.find('.chore-difficulty').text(data[i].difficulty);
        choresTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        choresRow.append(choresTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
    // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Tasks.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var TasksArtifact = data;
      App.contracts.Tasks = TruffleContract(TasksArtifact);
    
      // Set the provider for our contract
      App.contracts.Tasks.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted chores
      return App.markAccepted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleChore);
  },

  markAccepted: function() {
    var choreInstance;

App.contracts.Tasks.deployed().then(function(instance) {
  choreInstance = instance;

  return choreInstance.getKids.call();
}).then(function(kids) {
  for (i = 0; i < kids.length; i++) {
    if (kids[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-chore').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
  },

  handleChore: function(event) {
    event.preventDefault();

    var choreId = parseInt($(event.target).data('id'));

    var choreInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Tasks.deployed().then(function(instance) {
    choreInstance = instance;

    // Execute adopt as a transaction by sending account
    return choreInstance.task(choreId, {from: account});
  }).then(function(result) {
    return App.markAccepted();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
