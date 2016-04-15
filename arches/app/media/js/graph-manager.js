require([
    'jquery',
    'underscore',
    'knockout',
    'views/page-view',
    'views/graph-manager/graph',
    'views/graph-manager/branch-list',
    'views/graph-manager/node-list',
    'views/graph-manager/permissions-list',
    'views/graph-manager/node-form',
    'views/graph-manager/permissions-form',
    'views/graph-manager/branch-info',
    'models/node',
    'models/graph',
    'bootstrap-nifty'
], function($, _, ko, PageView, GraphView, BranchListView, NodeListView, PermissionsListView, NodeFormView, PermissionsFormView, BranchInfoView, NodeModel, GraphModel) {
    var graphData = JSON.parse($('#graph-data').val());
    var branches = JSON.parse($('#branches').val());
    var datatypes = JSON.parse($('#datatypes').val());
    var validations = JSON.parse($('#validations').val());

    var prepGraph = function(graph) {
        graph.nodes.forEach(function(node) {
            node.cardinality = 'n';
            if (node.nodeid === node.nodegroup_id) {
                var group = _.find(graph.nodegroups, function(nodegroup) {
                    return nodegroup.nodegroupid === node.nodeid;
                });
                node.cardinality = group.cardinality;
            }
        })
    };

    branches.forEach(function(branch){
        branch.selected = ko.observable(false);
        branch.filtered = ko.observable(false);
        prepGraph(branch.graph);
    }, this);

    prepGraph(graphData);

    var graphModel = new GraphModel({
        nodes: graphData.nodes,
        edges: graphData.edges,
        datatypes: datatypes
    });

    graphModel.on('changed', function(model, options){
        console.log('changed');
        viewModel.graphView.redraw(true);
    })

    var viewModel = {
        graphModel: graphModel
    };

    viewModel.graphView = new GraphView({
        el: $('#graph'),
        graphModel: graphModel
    });

    viewModel.nodeForm = new NodeFormView({
        el: $('#nodeCrud'),
        graphModel: graphModel,
        validations: validations
    });

    viewModel.graphView.on('node-clicked', function (node) {
        var editNode = graphModel.get('editNode');
        if (editNode() && editNode().dirty()) {
            viewModel.nodeForm.closeClicked(true);
            return;
        }
        graphModel.get('nodes')().forEach(function (node) {
            node.editing(false);
        });
        node.editing(true);
    });

    viewModel.branchList = new BranchListView({
        el: $('#branch-library'),
        branches: ko.observableArray(branches),
        graphModel: graphModel
    });

    viewModel.nodeList = new NodeListView({
        el: $('#node-listing'),
        graphModel: graphModel
    });

    viewModel.permissionsList = new PermissionsListView({
        el: $('#node-permissions')
    });

    viewModel.permissionsForm = new PermissionsFormView({
        el: $('#permissions-panel')
    });

    new PageView({
        viewModel: viewModel
    });

    var resize = function(){
        $('#graph').height($(window).height()-200);
        $('.tab-content').height($(window).height()-259);
        $('.grid-container').height($(window).height()-360);
        viewModel.graphView.resize();
    }

    $( window ).resize(resize);

    resize();
});
