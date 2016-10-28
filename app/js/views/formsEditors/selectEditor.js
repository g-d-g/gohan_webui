import Backbone from 'backbone';
import 'backbone-forms';

class SelectEditor extends Backbone.Form.editors.Select {
  setValue(value) {
    if (value) {
      super.setValue(value);
    }
  }

  render() {
    const searchThreshold = 6;
    const options = {
      container: 'body',
      width: '100%'
    };

    const optionLength = Object.keys(this.schema.options).length;

    if ((this.schema.options instanceof Array)) {
      const options = new Array(...this.schema.options);

      if (this.schema.nullable && !this.schema.validators.includes('required')) {
        this.setOptions(options.reduce((result, item) => {
          result[item] = item;

          return result;
        }, {'': 'Not selected'}));
      } else {
        this.setOptions(options);
      }
    } else {
      const sortedOptions = Object.keys(this.schema.options)
        .sort((a, b) => this.schema.options[a].localeCompare(this.schema.options[b]))
        .reduce((acc, val) => {
          acc[val] = this.schema.options[val];
          return acc;
        }, (() => {
          if (this.schema.nullable && !this.schema.validators.includes('required')) {
            return {'': 'Not selected'};
          }
          return {};
        })());

      this.setOptions(sortedOptions);
    }

    if (optionLength >= searchThreshold) {
      options.liveSearch = true;
    }
    this.$el.addClass('selectpicker');
    setTimeout(() => {
      this.$el.selectpicker(options);
    }, 0);
    return this;
  }
}

Backbone.Form.editors.Select = SelectEditor;
