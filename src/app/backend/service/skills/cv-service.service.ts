import { SkillGruppe } from './../interfaces/skillGruppe';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IntCvSkill } from '../../models/cvSkill';

@Injectable({
  providedIn: 'root'
})

export class CvServiceService {
  cvSkillCollection: AngularFirestoreCollection<IntCvSkill>;
  cvSkill: Observable<IntCvSkill[]>;
  skill: AngularFirestoreDocument<IntCvSkill>;

  skillGruppeCollection: AngularFirestoreCollection<SkillGruppe>;
  skillGruppe: Observable<SkillGruppe[]>;

  skillAdminCollection: AngularFirestoreCollection<IntCvSkill>;
  skillAdmin: Observable<IntCvSkill[]>;

  filterWert: 'Entwicklung';

  adminFilter: number;

  constructor(public afs: AngularFirestore) { }

  fetchingData() {
    this.cvSkillCollection = this.afs.collection('cv-skill', ref => ref.orderBy('skillwert', 'desc'));

    this.cvSkill = this.cvSkillCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as IntCvSkill;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    this.skillGruppeCollection = this.afs.collection('cv-skill');

    this.skillGruppe = this.skillGruppeCollection.valueChanges();
  }

  getSkills() {
    this.fetchingData();
    return this.cvSkill;
  }

  getSkillGruppen() {
    this.fetchingData();
    return this.skillGruppe;
  }

  addSkill(cvSkill: IntCvSkill) {
    this.cvSkillCollection.add(cvSkill);
  }

  updateSkill(cvSkill: IntCvSkill) {
    this.skill = this.afs.doc(`cv-skill/${cvSkill.id}`);
    this.skill.update(cvSkill);
  }

  deleteSkill(skill: IntCvSkill){
    this.skill = this.afs.doc(`cv-skill/${skill.id}`);
    this.skill.delete();
  }


  // ADMIN ################ ADMIN

  fetchingAdminData(filterWert: number) {
    this.skillAdminCollection = this.afs.collection('cv-skill', ref => ref.limit(filterWert));

    this.skillAdmin = this.skillAdminCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as IntCvSkill;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    this.cvSkillCollection = this.afs.collection('cv-skill');

    this.cvSkill = this.cvSkillCollection.valueChanges();
  }

  getAdminSKills(filterwert: number) {
    this.fetchingAdminData(filterwert);
    return this.skillAdmin;
  }

  filtereAdminSkills(filterwert: number) {
    this.adminFilter = filterwert;
  }


}
