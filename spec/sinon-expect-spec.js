var SinonExpect = require('../lib/sinon-expect'),
    newExpect;

//Before enhance
sinon.spy(SinonExpect, 'buildMatchers');

newExpect = SinonExpect.enhance(expect, sinon, 'was');

describe("sinon-expect", function(){

  var obj = {}, subject;

  beforeEach(function(){
    subject = newExpect(obj);
  });

  describe(".enhance", function(){

    beforeEach(function(){
      sinon.spy(expect, 'Assertion');
    });

    it("should have a copy of modified assertion on it to conform to spec", function(){
      expect(newExpect.Assertion).to.be(SinonExpect.ExpectWrapper);
    });

    it("should return modified expect that returns a SinonAssertions", function(){
      expect(subject).to.be.a(SinonExpect.ExpectWrapper);
      expect(subject).to.be.a(newExpect.Assertion);
    });

    it("should invoke original Assertion", function(){
      subject = newExpect(obj);
      expect(expect.Assertion.calledWithExactly(obj)).to.be(true);
    });

    it("should still have old flags", function(){
      expect(subject.to).to.be.a(expect.Assertion);
    });

    it("should contain new .was flag", function(){
      expect(subject.was).to.be.a(SinonExpect.SinonAssertions);
    });

    it("should initialize new .was flag with obj", function(){
      expect(subject.obj).to.be(obj);
      expect(subject.was.obj).to.be(subject.obj);
    });

    it("should invoke buildMatchers", function(){
      expect(SinonExpect.buildMatchers.called).to.be(true);
    });
  });

  describe(".buildMatchers", function(){

    var i = 0, len = SinonExpect.assertions.length;

    for(i, len; i < len; i++){
      (function(matcher){

        describe("sinon matcher ." + matcher, function(){

          beforeEach(function(){
            sinon.stub(sinon.assert, matcher, function(){
              return 'foo';
            });
          });

          it("should exist as a method on .was", function(){
            expect(subject.was[matcher]).to.be.a('function');
          });

          it("should invoke method on sinon.assert." + matcher, function(){
            newExpect(subject.obj).was[matcher]('foo', 'bar');
            expect(sinon.assert[matcher].calledWithExactly(
              obj,
              'foo',
              'bar'
            )).to.be(true);
          });
        });

      }(SinonExpect.assertions[i]));
    }
  });

  describe("sanity check", function(){

    var obj = {
      fn: function(){}
    };

    beforeEach(function(){
      sinon.stub(obj, 'fn');
    });

    it("should work on .called", function(){
      try {
        newExpect(obj.fn).was.called();
      } catch(e){
        expect(e.name).to.be('AssertError');
      }

      obj.fn();

      newExpect(obj.fn).was.called();
    });

    it("should not have screwed up expect", function(){
      newExpect(true).to.be(true);

      try {
        newExpect(true).to.be(false);
      } catch(e){
        expect(e.message).not.to.be.empty();
      }

    });

  });

});
