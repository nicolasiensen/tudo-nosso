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
  DELETE_UPVOTE_ERROR: "DELETE_UPVOTE_ERROR",

  CREATE_PARAGRAPH_UPVOTE_SUCCESS: "CREATE_PARAGRAPH_UPVOTE_SUCCESS",
  CREATE_PARAGRAPH_UPVOTE_BEFORE: "CREATE_PARAGRAPH_UPVOTE_BEFORE",
  CREATE_PARAGRAPH_UPVOTE_ERROR: "CREATE_PARAGRAPH_UPVOTE_ERROR",

  DELETE_PARAGRAPH_UPVOTE_SUCCESS: "DELETE_PARAGRAPH_UPVOTE_SUCCESS",
  DELETE_PARAGRAPH_UPVOTE_BEFORE: "DELETE_PARAGRAPH_UPVOTE_BEFORE",
  DELETE_PARAGRAPH_UPVOTE_ERROR: "DELETE_PARAGRAPH_UPVOTE_ERROR",

  LOAD_PARAGRAPH_UPVOTES_SUCCESS: "LOAD_PARAGRAPH_UPVOTES_SUCCESS"
};

documentFlux.store = Fluxxor.createStore({
  initialize: function() {
    this.contributions = [];
    this.paragraphUpvotes = [];
    this.newContribution = null;
    this.contributionIdUpvoting = null;
    this.paragraphHashUpvoting = null;

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
      documentFlux.constants.DELETE_UPVOTE_ERROR, this.onDeleteUpvoteError,

      documentFlux.constants.CREATE_PARAGRAPH_UPVOTE_SUCCESS, this.onCreateParagraphUpvoteSuccess,
      documentFlux.constants.CREATE_PARAGRAPH_UPVOTE_BEFORE, this.onCreateParagraphUpvoteBefore,
      documentFlux.constants.CREATE_PARAGRAPH_UPVOTE_ERROR, this.onCreateParagraphUpvoteError,

      documentFlux.constants.LOAD_PARAGRAPH_UPVOTES_SUCCESS, this.onLoadParagraphUpvotesSuccess,

      documentFlux.constants.DELETE_PARAGRAPH_UPVOTE_SUCCESS, this.onDeleteParagraphUpvoteSuccess,
      documentFlux.constants.DELETE_PARAGRAPH_UPVOTE_BEFORE, this.onDeleteParagraphUpvoteBefore,
      documentFlux.constants.DELETE_PARAGRAPH_UPVOTE_ERROR, this.onDeleteParagraphUpvoteError
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

    contribution.upvotes = contribution.upvotes.filter(function(u){
      return u.id != payload.id;
    });

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

  onCreateParagraphUpvoteSuccess: function(paragraphUpvote) {
    this.paragraphUpvotes.push(paragraphUpvote);
    this.paragraphHashUpvoting = null;
    this.emit("change");
  },

  onCreateParagraphUpvoteBefore: function(paragraphHash) {
    this.paragraphHashUpvoting = paragraphHash;
    this.emit("change");
  },

  onCreateParagraphUpvoteError: function(payload) {
    this.paragraphHashUpvoting = null;
    this.emit("change");
  },

  onLoadParagraphUpvotesSuccess: function(paragraphUpvotes) {
    this.paragraphUpvotes = paragraphUpvotes;
    this.emit("change");
  },

  onDeleteParagraphUpvoteBefore: function(paragraphUpvote) {
    this.paragraphHashUpvoting = paragraphUpvote.paragraph_hash;
    this.emit("change");
  },

  onDeleteParagraphUpvoteSuccess: function(paragraphUpvote) {
    this.paragraphHashUpvoting = null;
    this.paragraphUpvotes = this.paragraphUpvotes.filter(function(u){
      return u.id != paragraphUpvote.id;
    });

    this.emit("change");
  },

  onDeleteParagraphUpvoteError: function(payload) {
    this.paragraphHashUpvoting = null;
    this.emit("change");
  },

  getState: function() {
    return {
      contributions: this.contributions,
      newContribution: this.newContribution,
      contributionIdUpvoting: this.contributionIdUpvoting,
      paragraphUpvotes: this.paragraphUpvotes,
      paragraphHashUpvoting: this.paragraphHashUpvoting
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
  },

  createParagraphUpvote: function(paragraphHash, documentId, userApiToken) {
    $.ajax({
      url: "/api/v1/paragraph_upvotes",
      headers: { 'Authorization': 'Token token="' + userApiToken + '"' },
      data: {
        paragraph_upvote: {
          paragraph_hash: paragraphHash,
          document_id: documentId
        }
      },
      method: 'post',
      dataType: 'json',
      beforeSend: function() {
        this.dispatch(documentFlux.constants.CREATE_PARAGRAPH_UPVOTE_BEFORE, paragraphHash);
      }.bind(this),
      success: function(data) {
        this.dispatch(documentFlux.constants.CREATE_PARAGRAPH_UPVOTE_SUCCESS, data);
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        this.dispatch(documentFlux.constants.CREATE_PARAGRAPH_UPVOTE_ERROR,
          {jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
      }.bind(this)
    });
  },

  loadParagraphUpvotes: function(document_id) {
    $.ajax({
      url: "/api/v1/paragraph_upvotes",
      data: { document_id: document_id },
      method: 'get',
      dataType: 'json',
      success: function(data) {
        this.dispatch(documentFlux.constants.LOAD_PARAGRAPH_UPVOTES_SUCCESS, data);
      }.bind(this)
    });
  },

  deleteParagraphUpvote: function(paragraphUpvote, userApiToken) {
    $.ajax({
      url: "/api/v1/paragraph_upvotes/" + paragraphUpvote.id,
      headers: { 'Authorization': 'Token token="' + userApiToken + '"' },
      method: 'delete',
      dataType: 'html',
      beforeSend: function() {
        this.dispatch(documentFlux.constants.DELETE_PARAGRAPH_UPVOTE_BEFORE, paragraphUpvote);
      }.bind(this),
      success: function(data) {
        this.dispatch(documentFlux.constants.DELETE_PARAGRAPH_UPVOTE_SUCCESS, paragraphUpvote);
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        this.dispatch(documentFlux.constants.DELETE_PARAGRAPH_UPVOTE_ERROR,
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
