import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {createSpyObjFromClass} from '../../../test/test.helper';
import {ContentType} from '../constants/managed-content.constants';
import {CmSection} from '../models/managed-content.models';

import {ManagedContentService} from './managed-content.service';

describe('ManagedContentService', () => {

  describe('ManagedContentService testbed', () => {
    let managedContentService: ManagedContentService;
    let httpClientSpy: { get: jasmine.Spy};
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

      TestBed.configureTestingModule({
        providers: [
          ManagedContentService,
        ],
        imports: [
          HttpClientTestingModule
        ]
      });

      // Inject managed content service which imports HttpClient and Test Controller
      httpTestingController = TestBed.inject(HttpTestingController);
      managedContentService = TestBed.inject(ManagedContentService);
    });

    beforeEach(() => {
      spyOn(window.console, 'log').and.callFake(() => {});
    });

    afterEach(() => {
      httpTestingController.verify();
    });

  });


  describe('Managed Content Service Tests', () => {
    let httpClientSpy;
    let service: ManagedContentService;
    let spyError: jasmine.Spy;

    beforeEach(() => {
      httpClientSpy = createSpyObjFromClass(HttpClient);

      spyOn(window.console, 'log').and.callFake(() => {});
      spyOn(window.console, 'warn').and.callFake(() => {});
      spyError = spyOn(window.console, 'error').and.callFake(() => {});
    });

    it('should load content but return undefined for id that doesnt exist', () => {
      const sectionArr: Array<CmSection> = [];
      httpClientSpy.get.and.returnValues( of(sectionArr) );
      service = new ManagedContentService(httpClientSpy as any);

      service.loadManagedContent();

      expect(service.getContentById(ContentType.SECTION, 'id')).toBeUndefined();
    });

    it('should output an error in console when call fails', () => {
      httpClientSpy.get.and.returnValue(throwError(new Error()));
      service = new ManagedContentService(httpClientSpy as any);

      service.loadManagedContent();

      expect(spyError).toHaveBeenCalledWith('ERROR Getting Managed Content: ', new Error());
    });

    it('should return a map of results when searching using getContentBySelection', () => {

      const sectionArr: Array<CmSection> = [
        { id: 'ciw1', title: 'title1', body: 'body1', helpId: 'helpId1', tags:  '' },
        { id: 'ciw2', title: 'title2', body: 'body2', helpId: 'helpId2', tags:  '' },
        { id: 'ciw3', title: 'title3', body: 'body3', helpId: 'helpId3', tags:  '' },
        { id: 'ciw4', title: 'title4', body: 'body4', helpId: 'helpId4', tags:  '' }
      ];
      httpClientSpy.get.and.returnValues( of(sectionArr) );

      service = new ManagedContentService(httpClientSpy as any);
      service.loadManagedContent();

      const actualValue: Map<string, any> = service.getContentBySelection(ContentType.SECTION, 'ciw');
      expect(actualValue.size).toEqual(4);
    });

    it('should return an empt map of results when searching using getContentBySelection and no ids match', () => {

      const sectionArr: Array<CmSection> = [
        { id: 'ciw1', title: 'title1', body: 'body1', helpId: 'helpId1', tags:  '' },
        { id: 'ciw2', title: 'title2', body: 'body2', helpId: 'helpId2', tags:  '' },
        { id: 'ciw3', title: 'title3', body: 'body3', helpId: 'helpId3', tags:  '' },
        { id: 'ciw4', title: 'title4', body: 'body4', helpId: 'helpId4', tags:  '' }
      ];
      httpClientSpy.get.and.returnValues( of(sectionArr) );

      service = new ManagedContentService(httpClientSpy as any);
      service.loadManagedContent();

      const actualValue: Map<string, any> = service.getContentBySelection(ContentType.SECTION, 'rip');
      expect(actualValue.size).toEqual(0);
    });

    it('should return an empty map if the content type is undefined', () => {

      const sectionTestValues: Array<CmSection> = [
        { id: 'ciw1', title: 'title1', body: 'body1', helpId: 'helpId1', tags:  '' },
        { id: 'ciw2', title: 'title2', body: 'body2', helpId: 'helpId2', tags:  '' },
        { id: 'ciw3', title: 'title3', body: 'body3', helpId: 'helpId3', tags:  '' },
        { id: 'ciw4', title: 'title4', body: 'body4', helpId: 'helpId4', tags:  '' }
      ];

      httpClientSpy.get.and.returnValues( of(sectionTestValues) );

      service = new ManagedContentService(httpClientSpy as any);
      service.loadManagedContent();

      const actualValue: Map<string, any> = service.getContentBySelection(undefined, 'ciw');
      expect(actualValue.size).toEqual(0);
    });

    it('should create an empty map if service http call returns a non array', () => {
      httpClientSpy.get.and.returnValues(of({}) );

      service = new ManagedContentService(httpClientSpy as any);
      service.loadManagedContent();

      expect(service.getContentById(ContentType.SECTION, 'ciw')).toBeUndefined();
    });

    it('should return an empty map if the content type is undefined', () => {

      const sectionTestValues: Array<CmSection> = [
        { id: 'ciw1', title: 'title1', body: 'body1', helpId: 'helpId1', tags:  '' },
        { id: 'ciw2', title: 'title2', body: 'body2', helpId: 'helpId2', tags:  '' },
        { id: 'ciw3', title: 'title3', body: 'body3', helpId: 'helpId3', tags:  '' },
        { id: 'ciw4', title: 'title4', body: 'body4', helpId: 'helpId4', tags:  '' }
      ];

      httpClientSpy.get.and.returnValues( of(sectionTestValues) );

      service = new ManagedContentService(httpClientSpy as any);
      service.loadManagedContent();

      const actualValue: CmSection = service.getContentById(ContentType.SECTION, 'ciw1');
      expect(actualValue).toEqual(sectionTestValues[0]);
    });

  });

});
