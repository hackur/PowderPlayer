import _ from 'lodash';

var convertFileToObj = (results) => {
    // convert from file objects to normal objects
    return _.map(results, el => {
        return {
            name: el.name,
            path: el.path,
            size: el.size,
            type: el.type
        }
    });
}

var sorter = {

    parser: require('./parser'),

    episodes: (results, logic) => {
        logic = typeof logic !== 'undefined' ? logic : 1; // 1 - episode sort, 2 - episode sort (by .name)
        var perfect = false;

        if (results[0] && results[0].constructor == File)
            results = convertFileToObj(results);

        while (!perfect) {
            perfect = true;
            _.forEach(results, (el, ij) => {
                if (ij > 0) {
                    if (logic == 1) {
                        var clean = sorter.parser(el);
                        var prev = sorter.parser(results[ij-1]);
                    } else if (logic == 2) {
                        var clean = sorter.parser(el.name);
                        var prev = sorter.parser(results[ij-1].name);
                    }

                    if ((clean.season() == prev.season() && clean.episode() < prev.episode()) || (clean.season() < prev.season())) {
                        results[ij] = results[ij-1];
                        results[ij-1] = el;
                        perfect = false;
                    }
                }
            });
        }
        return results;
    },

    naturalSort: (arr, logic) => {
        // natural sort order function for playlist and library
        logic = typeof logic !== 'undefined' ? logic : 1; // 1 - natural sort, 2 - natural sort (by .name)

        if (arr[0] && arr[0].constructor == File)
            arr = convertFileToObj(arr);

        if (arr.length > 1) {
            var perfect = false;
            while (!perfect) {
                perfect = true;
                _.forEach(arr, (el, ij) => {
                    if (arr[ij+1]) {
                        if (logic == 1) var difference = sorter._alphanumCase(sorter.parser(el).name(),sorter.parser(arr[ij+1]).name());
                        else if (logic == 2) var difference = sorter._alphanumCase(sorter.parser(el.name).name(),sorter.parser(arr[ij+1].name).name());
                        if (difference > 0) {
                            perfect = false;
                            arr[ij] = arr[ij+1];
                            arr[ij+1] = el;
                        }
                    }
                });
            }
        }
        return arr;
    },

    _alphanumCase: (a, b) => {
      var chunkify = (t) => {
        var tz = new Array();
        var x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
          var m = (i == 46 || (i >=48 && i <= 57));
          if (m !== n) {
            tz[++y] = "";
            n = m;
          }
          tz[y] += j;
        }
        return tz;
      }

      var aa = chunkify(a.toLowerCase());
      var bb = chunkify(b.toLowerCase());

      for (var x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
          var c = Number(aa[x]), d = Number(bb[x]);
          if (c == aa[x] && d == bb[x]) {
            return c - d;
          } else return (aa[x] > bb[x]) ? 1 : -1;
        }
      }
      return aa.length - bb.length;
    }

};

module.exports = sorter;
