import * as go from "gojs";

export function customDiagram() {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
        $(go.Diagram,
            {
                'undoManager.isEnabled': true,  // must be set to allow for model change listening
                'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
                model: new go.GraphLinksModel(
                    {
                        linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                    })
            });

    // define a simple Node template
    diagram.nodeTemplate =
        $(go.Node, 'Auto',
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'Circle',
                { name: 'SHAPE', fill: 'white', strokeWidth: 0, maxSize: new go.Size(20, 20) },
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color'))
        );

    diagram.nodeTemplateMap.add("Start",
        $(go.Node, 'Auto',
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'MinusLine',
                { name: 'SHAPE', fill: 'white', margin:5, strokeWidth: 2, maxSize: new go.Size(20, 20) },
                // Shape.fill is bound to Node.data.color
                new go.Binding('stroke', 'color')
            ),
        )
    );

    diagram.nodeTemplateMap.add("End",
        $(go.Node, 'Auto',
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'PlusLine',
                { name: 'SHAPE', fill: 'white', margin:5, strokeWidth: 2, maxSize: new go.Size(20, 20) },
                // Shape.fill is bound to Node.data.color
                new go.Binding('stroke', 'color'))
        )
    );

    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            {
                curve: go.Link.Bezier,
                adjusting: go.Link.Stretch,
                reshapable: true, relinkableFrom: false, relinkableTo: false,
                fromShortLength: 4
            },
            new go.Binding("points").makeTwoWay(),
            new go.Binding("curviness"),
            $(go.Shape,  // the link shape
                { strokeWidth: 1.5 },
                new go.Binding('stroke', 'progress', () => 'black'),
                new go.Binding('strokeWidth', 'progress', () => 1.5)),
            $(go.Shape,  // the arrowhead
                { toArrow: "standard", stroke: null },
                new go.Binding('fill', 'progress', () => 'black')),
            $(go.Panel, "Auto",
                $(go.Shape,  // the label background, which becomes transparent around the edges
                    {
                        fill: $(go.Brush, "Radial",
                            { 0: "rgb(245, 245, 245)", 0.7: "rgb(245, 245, 245)", 1: "rgba(245, 245, 245, 0)" }),
                        stroke: null
                    }),
                $(go.TextBlock, "transition",  // the label text
                    {
                        textAlign: "center",
                        font: "9pt helvetica, arial, sans-serif",
                        margin: 4,
                        editable: false  // enable in-place editing
                    },
                    // editing the text automatically updates the model data
                    new go.Binding("text").makeTwoWay())
            )
        );

    diagram.contentAlignment = go.Spot.Center
    diagram.layout = new go.ForceDirectedLayout();

    return diagram;
}