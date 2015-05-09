var documentFlux = {};

documentFlux.constants = {
  CREATE_CONTRIBUTION_SUCCESS: "CREATE_CONTRIBUTION_SUCCESS",
  CREATE_CONTRIBUTION_BEFORE: "CREATE_CONTRIBUTION_BEFORE",
  CREATE_CONTRIBUTION_ERROR: "CREATE_CONTRIBUTION_ERROR",

  LOAD_CONTRIBUTIONS_SUCCESS: "LOAD_CONTRIBUTIONS_SUCCESS",

  CREATE_UPVOTE_SUCCESS: "CREATE_UPVOTE_SUCCESS",
  CREATE_UPVOTE_BEFORE: "CREATE_UPVOTE_BEFORE",
  CREATE_UPVOTE_ERROR: "CREATE_UPVOTE_ERROR",

  DELETE_UPVOTE_SUCCESS: "DELETE_UPVOTE_SUCCESS",
  DELETE_UPVOTE_BEFORE: "DELETE_UPVOTE_BEFORE",
  DELETE_UPVOTE_ERROR: "DELETE_UPVOTE_ERROR"
};

documentFlux.store = Fluxxor.createStore({
  initialize: function() {
    this.contributions = [];
    this.newContribution = null;
    this.contributionIdUpvoting = null;

    this.bindActions(
      documentFlux.constants.CREATE_CONTRIBUTION_SUCCESS, this.onCreateContributionSuccess,
      documentFlux.constants.CREATE_CONTRIBUTION_BEFORE, this.onCreateContributionBefore,
      documentFlux.constants.CREATE_CONTRIBUTION_ERROR, this.onCreateContributionError,

      documentFlux.constants.LOAD_CONTRIBUTIONS_SUCCESS, this.onLoadContributionsSuccess,

      documentFlux.constants.CREATE_UPVOTE_SUCCESS, this.onCreateUpvoteSuccess,
      documentFlux.constants.CREATE_UPVOTE_BEFORE, this.onCreateUpvoteBefore,
      documentFlux.constants.CREATE_UPVOTE_ERROR, this.onCreateUpvoteError,

      documentFlux.constants.DELETE_UPVOTE_SUCCESS, this.onDeleteUpvoteSuccess,
      documentFlux.constants.DELETE_UPVOTE_BEFORE, this.onDeleteUpvoteBefore,
      documentFlux.constants.DELETE_UPVOTE_ERROR, this.onDeleteUpvoteError
    );
  },

  onCreateContributionSuccess: function(payload) {
    this.contributions.unshift(payload);
    this.newContribution = null;
    this.emit("change");
  },

  onCreateContributionBefore: function(payload) {
    this.newContribution = payload;
    this.emit("change");
  },

  onCreateContributionError: function(payload) {
    this.newContribution = null;
    this.emit("change");
  },

  onLoadContributionsSuccess: function(payload) {
    this.contributions = payload;
    this.emit("change");
  },

  onCreateUpvoteSuccess: function(payload) {
    contribution = this.contributions.filter(function(c){
      return c.id == payload.contribution_id;
    })[0];

    contribution.upvotes.push(payload);
    this.contributionIdUpvoting = null;

    this.emit("change");
  },

  onCreateUpvoteBefore: function(payload) {
    this.contributionIdUpvoting = payload;
    this.emit("change");
  },

  onCreateUpvoteError: function(payload) {
    this.contributionIdUpvoting = null;
    this.emit("change");
  },

  onDeleteUpvoteSuccess: function(payload) {
    contribution = this.contributions.filter(function(c){
      return c.id == payload.contribution_id;
    })[0];

    contribution.upvotes.splice(payload, 1);
    this.contributionIdUpvoting = null;

    this.emit("change");
  },

  onDeleteUpvoteBefore: function(payload) {
    this.contributionIdUpvoting = payload.contribution_id;
    this.emit("change");
  },

  onDeleteUpvoteError: function(payload) {
    this.contributionIdUpvoting = null;
    this.emit("change");
  },

  getState: function() {
    return {
      contributions: this.contributions,
      newContribution: this.newContribution,
      contributionIdUpvoting: this.contributionIdUpvoting
    };
  }
});

documentFlux.actions = {
  createContribution: function(contribution, userApiToken) {
    $.ajax({
      url: "/api/v1/contributions",
      headers: { 'Authorization': 'Token token="' + userApiToken + '"' },
      data: { contribution: contribution },
      method: 'post',
      dataType: 'json',
      beforeSend: function() {
        this.dispatch(documentFlux.constants.CREATE_CONTRIBUTION_BEFORE, contribution);
      }.bind(this),
      success: function(data) {
        this.dispatch(documentFlux.constants.CREATE_CONTRIBUTION_SUCCESS, data);
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        this.dispatch(documentFlux.constants.CREATE_CONTRIBUTION_ERROR,
          {jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
      }.bind(this)
    });
  },

  loadContributions: function(document_id) {
    $.ajax({
      url: "/api/v1/contributions",
      data: { document_id: document_id },
      method: 'get',
      dataType: 'json',
      success: function(data) {
        this.dispatch(documentFlux.constants.LOAD_CONTRIBUTIONS_SUCCESS, data);
      }.bind(this)
    });
  },

  createUpvote: function(contributionId, userApiToken) {
    $.ajax({
      url: "/api/v1/upvotes",
      headers: { 'Authorization': 'Token token="' + userApiToken + '"' },
      data: { upvote: {contribution_id: contributionId} },
      method: 'post',
      dataType: 'json',
      beforeSend: function() {
        this.dispatch(documentFlux.constants.CREATE_UPVOTE_BEFORE, contributionId);
      }.bind(this),
      success: function(data) {
        this.dispatch(documentFlux.constants.CREATE_UPVOTE_SUCCESS, data);
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        this.dispatch(documentFlux.constants.CREATE_UPVOTE_ERROR,
          {jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
      }.bind(this)
    });
  },

  deleteUpvote: function(upvote, userApiToken) {
    $.ajax({
      url: "/api/v1/upvotes/" + upvote.id,
      headers: { 'Authorization': 'Token token="' + userApiToken + '"' },
      method: 'delete',
      dataType: 'html',
      beforeSend: function() {
        this.dispatch(documentFlux.constants.DELETE_UPVOTE_BEFORE, upvote);
      }.bind(this),
      success: function(data) {
        this.dispatch(documentFlux.constants.DELETE_UPVOTE_SUCCESS, upvote);
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        this.dispatch(documentFlux.constants.DELETE_UPVOTE_ERROR,
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
