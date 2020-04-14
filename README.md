Ugly-coded, non-optimized, simple map drawer for Mystera.

You'll need to setup a server and send data in this format:

```javascript
{
  "width":80,
  "height":80,
  "data":[{"x":0,"y":0,"sprite":0,"fog":0,"visited":0,"block":0,"objects":[]},
    {"x":0,"y":1,"sprite":0,"fog":0,"visited":0,"block":0,"objects":[]},
    {"x":0,"y":2,"sprite":0,"fog":0,"visited":0,"block":0,"objects":[]},
    {"x":0,"y":3,"sprite":0,"fog":0,"visited":0,"block":0,"objects":[]},
    {"x":0,"y":4,"sprite":21,"fog":0,"visited":0,"block":1,"objects":[{"x":0,"y":4,"template":"1","name":"Dirt","build":"-577b","sprite":-577,"can_block":1,"can_stack":1,"can_pickup":0}]},
    {"x":0,"y":5,"sprite":36,"fog":0,"visited":0,"block":1,"objects":[{"x":0,"y":5,"template":"1","name":"Dirt","build":"-577b","sprite":-577,"can_block":1,"can_stack":1,"can_pickup":0}]},
    ...
  }]
}
```

Basically, x/y of the sprite, the sprite, fog and visited are optional but is what I used for another project, block 1/0 and an array of objects.

Self-explainatory for anyone working in the map.

Questions feel free to contact@januariopinto.com