var tape = require('tape'),
    comb = require('.');


tape('flip', (t)=>{

    t.plan(1);

    var result = comb.flip('ABCDE'.split(''), 'XYZ'.split(''));

    t.deepEqual(result, [
        ['A', 'X'],
        ['B', 'Y'],
        ['C', 'Z'],
        ['D', 'Y'],
        ['E', 'X']
    ]);

});

tape('holistic', (t)=>{

    t.plan(1);

    var result = comb.holistic('ABC'.split(''), 'XYZ'.split(''), [0,1,2]);

    console.log(result);

    t.deepEqual(result, [
        ['A', 'X'],
        ['B', 'X'],
        ['C', 'X'],
        ['A', 'Y'],
        ['B', 'Y'],
        ['C', 'Y'],
        ['A', 'Z'],
        ['B', 'Z'],
        ['C', 'Z']
    ]);
});

