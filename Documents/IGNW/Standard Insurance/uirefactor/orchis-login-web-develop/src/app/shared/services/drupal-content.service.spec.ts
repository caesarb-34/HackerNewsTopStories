import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {createSpyObjFromClass} from '../../../test/test.helper';
import {DrupalContentService} from './drupal-content.service';

describe('DrupalContentService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: DrupalContentService;

  beforeEach(() => {
    httpClientSpy = createSpyObjFromClass(HttpClient);
    service = new DrupalContentService(httpClientSpy as jasmine.SpyObj<HttpClient>);
  });

  it('should get value', () => {
        const response = {
          body:
            {
            copyrightString: 'u00A9 2018 StanCorp Financial Group, Inc.',
            links: [{
              target: '_blank',
              href: 'https://www.standard.com/financial-professional/contact-us',
              label: 'Contact Us'
            }, {
              target: '_blank',
              href: 'https://www.standard.com/careers',
              label: 'Careers'
            }, {
              target: '_blank',
              href: 'https://www.standard.com/news?f[0]=field_audience%3A3',
              label: 'News'
            }, {
              target: '_blank',
              href: 'http://phx.corporate-ir.net/phoenix.zhtml?c=72431&amp;p=irol-irhome',
              label: 'Investor Relations'
            }, {
              target: '_blank',
              href: 'https://www.standard.com/investment-advisers?id=\'financial-professional\'',
              label: 'Investment Advisers'
            }, {
              target: '_blank',
              href: 'https://www.standard.com/mortgages',
              label: 'Mortgages'
            }, {
              target: '_blank',
              href: 'https://www.standard.com/legal-privacy',
              label: 'Legal &amp; Privacy'
            }]
          }
        };
        httpClientSpy.get.and.returnValue(of(response));

        service.getContent('disclosures/id/1').subscribe(res => {
          expect(res).not.toBeNull();
        });
      });
});
