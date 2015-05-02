var documentFlux = {};

documentFlux.constants = {
  CREATE_CONTRIBUTION_SUCCESS: "CREATE_CONTRIBUTION_SUCCESS",
  CREATE_CONTRIBUTION_BEFORE: "CREATE_CONTRIBUTION_BEFORE",
  CREATE_CONTRIBUTION_ERROR: "CREATE_CONTRIBUTION_ERROR"
};

documentFlux.store = Fluxxor.createStore({
  initialize: function() {
    this.contributions = [];
    this.loading = false;
    this.bindActions(
      documentFlux.constants.CREATE_CONTRIBUTION_SUCCESS, this.onCreateContributionSuccess,
      documentFlux.constants.CREATE_CONTRIBUTION_BEFORE, this.onCreateContributionBefore,
      documentFlux.constants.CREATE_CONTRIBUTION_ERROR, this.onCreateContributionError
    );
  },

  onCreateContributionSuccess: function(payload) {
    this.contributions.push(payload);
    this.loading = false;
    this.emit("change");
  },

  onCreateContributionBefore: function() {
    this.loading = true;
    this.emit("change");
  },

  onCreateContributionError: function(payload) {
    console.log(payload);
    this.loading = false;
    this.emit("change");
  },

  getState: function() {
    return { contributions: this.contributions, loading: this.loading };
  }
});

documentFlux.actions = {
  createContribution: function(contribution, userApiToken) {
    url = "/api/v1/contributions";

    $.ajax({
      url: url,
      headers: { 'Authorization': 'Token token="' + userApiToken + '"' },
      data: { contribution: contribution },
      method: 'post',
      dataType: 'json',
      beforeSend: function() {
        this.dispatch(documentFlux.constants.CREATE_CONTRIBUTION_BEFORE);
      }.bind(this),
      success: function(data) {
        this.dispatch(documentFlux.constants.CREATE_CONTRIBUTION_SUCCESS, data);
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        this.dispatch(documentFlux.constants.CREATE_CONTRIBUTION_ERROR,
          {jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
      }.bind(this)
    });
  }
};

documentFlux.flux = new Fluxxor.Flux(
  { DocumentStore: new documentFlux.store() },
  documentFlux.actions
);

documentFlux.init = function(options) {
  React.render(
    <Document
      document={options.document}
      currentUser={options.currentUser}
      flux={documentFlux.flux} />,
    document.getElementById('document-component'));
}
