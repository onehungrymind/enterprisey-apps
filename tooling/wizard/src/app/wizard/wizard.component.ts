import { Component } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NameVariations, Schema } from '../common/api-interfaces';
import { generateNameVariations } from '../common/name-variations.generator';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import {
  HighlightAutoResult,
  HighlightModule,
  HIGHLIGHT_OPTIONS,
} from 'ngx-highlightjs';

import pluralize from 'pluralize';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-wizard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    CodemirrorModule,
    FormsModule,
    HighlightModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        lineNumbers: true,
        fullLibraryLoader: () => import('highlight.js'),
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
        themePath:
          'node_modules/highlight.js/styles/base16/material-darker.css',
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.scss',
})
export class WizardComponent {
  refTemplate = '';
  templates: string[] = [];

  baseKeyword = '';
  baseKeywords = [];
  baseTemplate = '';

  schemas: Schema[] = [
    {
      "model": "challenge",
      "modelPlural": "challenges",
      "visible": true,
      "props": []
    },
    {
      "model": "flashcard",
      "modelPlural": "flashcards",
      "visible": true,
      "props": []
    },
    {
      "model": "note",
      "modelPlural": "notes",
      "visible": true,
      "props": []
    }
  ];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  displayedColumns: string[] = ['model', 'modelPlural'];

  editorOptions = {
    theme: 'material-darker',
    mode: 'application/ld+json',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    autoCloseBrackets: true,
    foldGutter: true,
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
  };

  response: HighlightAutoResult;

  onHighlight(e: HighlightAutoResult) {
    this.response = {
      language: e.language,
      relevance: e.relevance,
      secondBest: '{...}',
      value: '{...}',
    };
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const modelPlural = pluralize(value);
      this.schemas = [
        ...this.schemas,
        { model: value, modelPlural, visible: true, props: [] },
      ];

      this.generateTemplates();
    }

    // Clear the input value
    event.chipInput?.clear();
  }

  // This is definitely NOT functional ¯\_(ツ)_/¯
  generateTemplates() {
    this.templates = this.generate(this.baseTemplate, this.schemas);
  }

  remove(schema: Schema): void {
    const index = this.schemas.indexOf(schema);

    if (index >= 0) {
      this.schemas = this.schemas.filter((_, i) => i !== index);
    }
  }

  edit(schema: Schema, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(schema);
      return;
    }

    const index = this.schemas.indexOf(schema);
    if (index > 0) {
      this.schemas[index].model = value;
    }
  }

  generateBaseKeywords(keyword: string) {
    const schema = { model: keyword, modelPlural: pluralize(keyword) };
    const nameVariations = generateNameVariations(schema);
    return this.generateKeywords(nameVariations);
  }

  generateBaseTemplate(keyword: string) {
    this.baseKeyword = keyword;
    this.baseKeywords = this.generateBaseKeywords(keyword);
    this.baseTemplate = this.updateTemplate(
      this.refTemplate,
      this.baseKeywords
    );
  }

  addNameVariations(schemas: Schema[]) {
    return schemas.map((schema) =>
      Object.assign({}, schema, {
        nameVariations: generateNameVariations(schema),
      })
    );
  }

  generateKeywords(nameVariations: NameVariations) {
    return [
      { word: nameVariations.models, target: `\${models}` },
      { word: nameVariations.model, target: `\${model}` },
      { word: nameVariations.refs, target: `\${refs}` },
      { word: nameVariations.ref, target: `\${ref}` },
    ];
  }

  updateTemplateKeyword(src, keyword, target) {
    const re = new RegExp(`${keyword}`, 'g');
    return src.replace(re, target);
  }

  updateTemplateKeywords(src, keywords) {
    keywords.forEach((keyword) => {
      src = this.updateTemplateKeyword(src, keyword.word, keyword.target);
    });
    return src;
  }

  updateTemplate(template, keywords) {
    return this.updateTemplateKeywords(template, keywords);
  }

  parseRawTemplate(rawTemplate, nameVariations) {
    const parts = rawTemplate.split(/\$\{(?!\d)[\wæøåÆØÅ]*\}/);
    const args = rawTemplate.match(/\b[^{\}]+(?=})\b/g) || [];

    const parameters = args.map(
      (argument) =>
        nameVariations[argument] ||
        (nameVariations[argument] === undefined ? '' : nameVariations[argument])
    );
    return String.raw({ raw: parts }, ...parameters);
  }

  generate(template, schemas) {
    const fullSchemas = this.addNameVariations(schemas);
    return fullSchemas.map((schema) => {
      return this.parseRawTemplate(template, schema.nameVariations);
    });
  }
}
